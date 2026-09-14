import { NextResponse } from 'next/server';
import { validateSignature, WebhookEvent } from '@line/bot-sdk';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import { FinanceRepository } from '@/lib/repositories/finance.repository';
import { HabitRepository } from '@/lib/repositories/habit.repository';

async function replyMessage(replyToken: string, text: string, accessToken: string) {
  if (replyToken === '00000000000000000000000000000000' || replyToken === 'ffffffffffffffffffffffffffffffff') {
    return;
  }
  
  console.log(`Sending reply to LINE: "${text.substring(0, 50)}..."`);
  
  const res = await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: 'text', text }]
    })
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('LINE API Reply Error:', res.status, errorText);
  } else {
    console.log('LINE Reply Success');
  }
}

export async function POST(request: Request) {
  const channelSecret = process.env.LINE_CHANNEL_SECRET || process.env.CHANNEL_SECRET || '';
  let channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || process.env.CHANNEL_ACCESS_TOKEN || '';
  
  // Clean up token in case it was pasted with quotes in Vercel
  channelAccessToken = channelAccessToken.replace(/^"|"$/g, '').replace(/^'|'$/g, '');

  const glmApiKey = process.env.GLM_API_KEY || process.env.gGLM_API_KEY || 'dummy_key_for_build';

  const bodyText = await request.text();
  const signature = request.headers.get('x-line-signature') || '';

  if (process.env.NODE_ENV === 'production' && !validateSignature(bodyText, channelSecret, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let body;
  try {
    body = JSON.parse(bodyText);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const events: WebhookEvent[] = body.events || [];

  const ai = new OpenAI({
    apiKey: glmApiKey,
    baseURL: 'https://open.bigmodel.cn/api/paas/v4/'
  });

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const text = event.message.text;
      const lineUserId = event.source.userId;
      const replyToken = event.replyToken;

      console.log(`Received message from ${lineUserId}: ${text}`);

      if (!lineUserId) continue;

      // 1. Check if user is linked
      let user = null;
      try {
        user = await prisma.user.findUnique({ where: { lineUserId } });
      } catch (e) {
        console.error("Prisma Error:", e);
      }
      
      if (!user) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${request.headers.get('host')}`;
        const linkUrl = `${appUrl}/api/auth/line-link?lineUserId=${lineUserId}`;
        await replyMessage(replyToken, `👋 สวัสดีครับ!\nดูเหมือนว่าคุณยังไม่ได้ผูกบัญชี LINE เข้ากับ AI-Native OS ของคุณเลย\n\nกรุณากดลิงก์ด้านล่างเพื่อผูกบัญชีก่อนใช้งานนะครับ:\n${linkUrl}`, channelAccessToken);
        continue;
      }

      // 2. Pass to GLM API with Tools
      try {
        console.log("Calling GLM API...");
        const response = await ai.chat.completions.create({
          model: 'glm-5.3-flash',
          messages: [
            { role: "system", content: "You are the Antigravity AI Assistant integrated into LINE. The user is talking to you via LINE. Parse their request and use tools if they want to save expenses, add habits, etc. If they just say hi, reply friendly in Thai." },
            { role: "user", content: text }
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "add_transaction",
                description: "Add a financial transaction (income or expense) to the database.",
                parameters: {
                  type: "object",
                  properties: {
                    amount: { type: "number", description: "The amount of money" },
                    label: { type: "string", description: "What the money was spent on or earned from" },
                    type: { type: "string", enum: ["income", "expense"], description: "Whether it is income or expense" }
                  },
                  required: ["amount", "label", "type"]
                }
              }
            },
            {
              type: "function",
              function: {
                name: "add_habit",
                description: "Add a new daily quest/habit to the Habit RPG game.",
                parameters: {
                  type: "object",
                  properties: {
                    title: { type: "string", description: "The name of the habit or quest to add" }
                  },
                  required: ["title"]
                }
              }
            }
          ]
        });

        const message = response.choices[0].message;
        const toolCalls = message.tool_calls;
        let replyText = message.content || "รับทราบครับ ทำการจัดการให้เรียบร้อยแล้ว!";
        console.log("GLM API replied:", replyText, "Tool calls:", toolCalls?.length || 0);

        if (toolCalls && toolCalls.length > 0) {
          for (const call of toolCalls) {
            const args = JSON.parse(call.function.arguments);
            console.log(`Executing tool: ${call.function.name} with args:`, args);
            if (call.function.name === 'add_transaction') {
              const { amount, label, type } = args;
              await FinanceRepository.addTransaction(user.id, Number(amount), label as string, type as string);
              replyText = `💸 บันทึก${type === 'income' ? 'รายรับ' : 'รายจ่าย'} '${label}' จำนวน ${amount} บาท เรียบร้อยแล้วครับ!`;
            } else if (call.function.name === 'add_habit') {
              const { title } = args;
              await HabitRepository.addHabit(user.id, title as string);
              replyText = `🧙‍♂️ เพิ่มเควสรายวัน '${title}' ให้ฮีโร่ของคุณเรียบร้อยแล้วครับ!`;
            }
          }
        }

        await replyMessage(replyToken, replyText, channelAccessToken);

      } catch (err) {
        console.error('AI Processing Error:', err);
        await replyMessage(replyToken, 'ขออภัยครับ ระบบ AI เกิดข้อผิดพลาดชั่วคราว ลองใหม่อีกครั้งนะครับ 😅', channelAccessToken);
      }
    }
  }

  return NextResponse.json({ status: 'ok' });
}
