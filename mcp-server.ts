import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { prisma } from "./lib/prisma";

const server = new Server(
  { name: "financeflow-db", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_financial_summary",
        description: "Get total expenses grouped by label for a specific user.",
        inputSchema: {
          type: "object",
          properties: {
            userEmail: { type: "string" }
          },
          required: ["userEmail"]
        }
      },
      {
        name: "add_transaction",
        description: "Add a financial transaction.",
        inputSchema: {
          type: "object",
          properties: {
            userEmail: { type: "string" },
            amount: { type: "number" },
            label: { type: "string" },
            type: { type: "string", enum: ["income", "expense"] }
          },
          required: ["userEmail", "amount", "label", "type"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === "get_financial_summary") {
    const user = await prisma.user.findUnique({ where: { email: String(args.userEmail) } });
    if (!user) throw new Error("User not found");

    const summary = await prisma.financeTransaction.groupBy({
      by: ['label'],
      where: { userId: user.id, type: 'expense' },
      _sum: { amount: true }
    });
    
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }]
    };
  }

  if (name === "add_transaction") {
    const user = await prisma.user.findUnique({ where: { email: String(args.userEmail) } });
    if (!user) throw new Error("User not found");

    const tx = await prisma.financeTransaction.create({
      data: {
        userId: user.id,
        amount: Number(args.amount),
        label: String(args.label),
        type: String(args.type)
      }
    });
    
    return {
      content: [{ type: "text", text: JSON.stringify(tx, null, 2) }]
    };
  }

  throw new Error(`Tool not found: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("FinanceFlow MCP Server running on stdio");
}

main().catch(console.error);
