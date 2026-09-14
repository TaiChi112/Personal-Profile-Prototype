import { NextResponse } from 'next/server';
import { validateSignature, WebhookEvent } from '@line/bot-sdk';
import { GoogleGenAI, Type } from '@google/genai';
import { prisma } from '@/lib/prisma';
import { FinanceRepository } from '@/lib/repositories/finance.repository';
import { HabitRepository } from '@/lib/repositories/habit.repository';

const channelSecret = process.env.LINE_CHANNEL_SECRET || '';
const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';
const geminiApiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({ apiKey: geminiApiKey });

async function replyMessage(replyToken: string, text: string) {
  await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${channelAccessToken}`
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: 'text', text }]
    })
  });
}

export async function POST(request: Request) {
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

  const events: WebhookEvent[] = body.events;

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const text = event.message.text;
      const lineUserId = event.source.userId;
      const replyToken = event.replyToken;

      if (!lineUserId) continue;

      // 1. Check if user is linked
      const user = await prisma.user.findUnique({ where: { lineUserId } });
      if (!user) {
        // Not linked, send link message
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${request.headers.get('host')}`;
        const linkUrl = `${appUrl}/api/auth/line-link?lineUserId=${lineUserId}`;
        
        await replyMessage(replyToken, `👋 สวัสดีครับ!\nดูเหมือนว่าคุณยังไม่ได้ผูกบัญชี LINE เข้ากับ AI-Native OS ของคุณเลย\n\nกรุณากดลิงก์ด้านล่างเพื่อผูกบัญชีก่อนใช้งานนะครับ:\n${linkUrl}`);
        continue;
      }

      // 2. Pass to Gemini API with Tools
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: text,
          config: {
            systemInstruction: "You are the Antigravity AI Assistant integrated into LINE. The user is talking to you via LINE. Parse their request and use tools if they want to save expenses, add habits, etc. If they just say hi, reply friendly in Thai.",
            tools: [
              {
                functionDeclarations: [
                  {
                    name: "add_transaction",
                    description: "Add a financial transaction (income or expense) to the database.",
                    parameters: {
                      type: Type.OBJECT,
                      properties: {
                        amount: { type: Type.NUMBER, description: "The amount of money" },
                        label: { type: Type.STRING, description: "What the money was spent on or earned from" },
                        type: { type: Type.STRING, enum: ["income", "expense"], description: "Whether it is income or expense" }
                      },
                      required: ["amount", "label", "type"]
                    }
                  },
                  {
                    name: "add_habit",
                    description: "Add a new daily quest/habit to the Habit RPG game.",
                    parameters: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING, description: "The name of the habit or quest to add" }
                      },
                      required: ["title"]
                    }
                  }
                ]
              }
            ]
          }
        });

        const functionCalls = response.functionCalls;
        let replyText = response.text || "รับทราบครับ ทำการจัดการให้เรียบร้อยแล้ว!";

        if (functionCalls && functionCalls.length > 0) {
          // Process function calls
          for (const call of functionCalls) {
            if (call.name === 'add_transaction') {
              const { amount, label, type } = call.args;
              await FinanceRepository.addTransaction(user.id, Number(amount), label as string, type as string);
              replyText = `💸 บันทึก${type === 'income' ? 'รายรับ' : 'รายจ่าย'} '${label}' จำนวน ${amount} บาท เรียบร้อยแล้วครับ!`;
            } else if (call.name === 'add_habit') {
              const { title } = call.args;
              await HabitRepository.addHabit(user.id, title as string);
              replyText = `🧙‍♂️ เพิ่มเควสรายวัน '${title}' ให้ฮีโร่ของคุณเรียบร้อยแล้วครับ!`;
            }
          }
        }

        await replyMessage(replyToken, replyText);

      } catch (err) {
        console.error('AI Processing Error:', err);
        await replyMessage(replyToken, 'ขออภัยครับ ระบบ AI เกิดข้อผิดพลาดชั่วคราว ลองใหม่อีกครั้งนะครับ 😅');
      }
    }
  }

  return NextResponse.json({ status: 'ok' });
}
