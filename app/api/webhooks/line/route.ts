import { validateSignature, type webhook } from "@line/bot-sdk";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  redactPiiString,
  runWithCircuitGuard,
} from "@/app/lib/ai/bridgeRuntime";
import { prisma } from "@/lib/prisma";
import { FinanceRepository } from "@/lib/repositories/finance.repository";
import { HabitRepository } from "@/lib/repositories/habit.repository";

async function replyMessage(
  replyToken: string,
  text: string,
  accessToken: string,
) {
  if (
    replyToken === "00000000000000000000000000000000" ||
    replyToken === "ffffffffffffffffffffffffffffffff"
  ) {
    return;
  }

  console.log(`Sending reply to LINE: "${text.substring(0, 50)}..."`);

  const res = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: "text", text }],
    }),
  });

  if (res.ok) {
    console.log("LINE Reply Success");
  } else {
    const errorText = await res.text();
    console.error("LINE API Reply Error:", res.status, errorText);
  }
}

export async function POST(request: Request) {
  const channelSecret =
    process.env.LINE_CHANNEL_SECRET || process.env.CHANNEL_SECRET || "";
  let channelAccessToken =
    process.env.LINE_CHANNEL_ACCESS_TOKEN ||
    process.env.CHANNEL_ACCESS_TOKEN ||
    "";

  // Clean up token in case it was pasted with quotes in Vercel
  channelAccessToken = channelAccessToken
    .replace(/^"|"$/g, "")
    .replace(/^'|'$/g, "");

  const glmApiKey = (
    process.env.GLM_API_KEY ||
    process.env.gGLM_API_KEY ||
    ""
  ).trim();
  const hasGlmKey = glmApiKey.length > 0 && glmApiKey !== "dummy_key_for_build";

  const bodyText = await request.text();
  const signature = request.headers.get("x-line-signature") || "";

  if (
    process.env.NODE_ENV === "production" &&
    !validateSignature(bodyText, channelSecret, signature)
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: { events?: webhook.Event[] };
  try {
    body = JSON.parse(bodyText) as { events?: webhook.Event[] };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const events: webhook.Event[] = body.events || [];

  const ai = new OpenAI({
    apiKey: hasGlmKey ? glmApiKey : "dummy_key_for_build",
    baseURL: "https://open.bigmodel.cn/api/paas/v4/",
  });

  for (const event of events) {
    if (event.type === "message" && event.message.type === "text") {
      const text = event.message.text;
      const lineUserId = event.source?.userId;
      const replyToken = event.replyToken;

      if (!lineUserId || !replyToken) {
        continue;
      }

      // 1. Check if user is linked
      let user = null;
      try {
        user = await prisma.user.findUnique({ where: { lineUserId } });
      } catch (e) {
        console.error("Prisma Error:", e);
      }

      if (!user) {
        const appUrl =
          process.env.NEXT_PUBLIC_APP_URL ||
          `https://${request.headers.get("host")}`;
        const linkUrl = `${appUrl}/api/auth/line-link?lineUserId=${lineUserId}`;
        await replyMessage(
          replyToken,
          `สวัสดีครับ ดูเหมือนว่าคุณยังไม่ได้ผูกบัญชี LINE เข้ากับ AI-Native OS กรุณากดลิงก์ด้านล่างเพื่อผูกบัญชีก่อนใช้งาน:\n${linkUrl}`,
          channelAccessToken,
        );
        continue;
      }

      // 2. Redact PII before passing text to external GLM/OpenAI model under Circuit Breaker guard
      const { sanitized: safeUserText } = redactPiiString(
        text,
        user.name ? [user.name] : [],
        { routeKey: "webhooks:line-ai" },
      );

      const bridge = await runWithCircuitGuard({
        routeKey: "webhooks:line-ai",
        hasKey: hasGlmKey,
        timeoutMs: 12_000,
        execute: async (abortSignal) =>
          ai.chat.completions.create(
            {
              model: "glm-5.3-flash",
              messages: [
                {
                  role: "system",
                  content:
                    "You are the AI Assistant for FinanceFlow and HabitRPG. Never output emojis. If the user mentions spending money, buying something, or earning money, use add_transaction. If they mention adding a quest or habit, use add_habit. If no tool is applicable, reply politely in Thai.",
                },
                { role: "user", content: safeUserText },
              ],
              tools: [
                {
                  type: "function",
                  function: {
                    name: "add_transaction",
                    description:
                      "Add a financial transaction (income or expense) to the database.",
                    parameters: {
                      type: "object",
                      properties: {
                        amount: {
                          type: "number",
                          description: "The amount of money",
                        },
                        label: {
                          type: "string",
                          description:
                            "What the money was spent on or earned from",
                        },
                        type: {
                          type: "string",
                          enum: ["income", "expense"],
                          description: "Whether it is income or expense",
                        },
                      },
                      required: ["amount", "label", "type"],
                    },
                  },
                },
                {
                  type: "function",
                  function: {
                    name: "add_habit",
                    description:
                      "Add a new daily quest/habit to the Habit RPG game.",
                    parameters: {
                      type: "object",
                      properties: {
                        title: {
                          type: "string",
                          description: "The name of the habit or quest to add",
                        },
                      },
                      required: ["title"],
                    },
                  },
                },
              ],
            },
            { signal: abortSignal },
          ),
      });

      if (!bridge.ok) {
        const fallbackMsg =
          bridge.reason === "CIRCUIT_OPEN"
            ? "ขออภัยครับ ระบบ AI กำลังพักชั่วคราว (Circuit Breaker Active) กรุณาลองใหม่อีกครั้งในอีก 1 นาที"
            : "ขออภัยครับ ระบบ AI ไม่พร้อมใช้งานชั่วคราว สามารถใช้งานผ่านหน้าเว็บได้ตามปกติครับ";
        await replyMessage(replyToken, fallbackMsg, channelAccessToken);
        continue;
      }

      const message = bridge.data.choices[0]?.message;
      const toolCalls = message?.tool_calls;
      let replyText = message?.content || "รับทราบครับ ทำการจัดการให้เรียบร้อยแล้ว";

      if (toolCalls && toolCalls.length > 0) {
        for (const call of toolCalls) {
          if (call.type !== "function") {
            continue;
          }
          const args = JSON.parse(call.function.arguments) as Record<
            string,
            unknown
          >;
          if (call.function.name === "add_transaction") {
            const amount = Number(args.amount);
            const label = String(args.label ?? "");
            const type = String(args.type ?? "expense");
            await FinanceRepository.addTransaction(
              user.id,
              amount,
              label,
              type,
            );
            replyText = `บันทึก${type === "income" ? "รายรับ" : "รายจ่าย"} '${label}' จำนวน ${amount} บาท เรียบร้อยแล้วครับ`;
          } else if (call.function.name === "add_habit") {
            const title = String(args.title ?? "");
            await HabitRepository.addHabit(user.id, title);
            replyText = `เพิ่มเควสรายวัน '${title}' เรียบร้อยแล้วครับ`;
          }
        }
      }

      await replyMessage(replyToken, replyText, channelAccessToken);
    }
  }

  return NextResponse.json({ status: "ok" });
}
