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
      },
      {
        name: "get_kanban_tasks",
        description: "Get all kanban tasks for a specific user.",
        inputSchema: {
          type: "object",
          properties: {
            userEmail: { type: "string" }
          },
          required: ["userEmail"]
        }
      },
      {
        name: "add_kanban_task",
        description: "Add a kanban task.",
        inputSchema: {
          type: "object",
          properties: {
            userEmail: { type: "string" },
            title: { type: "string" }
          },
          required: ["userEmail", "title"]
        }
      },
      {
        name: "update_kanban_status",
        description: "Update the status of a kanban task.",
        inputSchema: {
          type: "object",
          properties: {
            userEmail: { type: "string" },
            taskId: { type: "string" },
            status: { type: "string" }
          },
          required: ["userEmail", "taskId", "status"]
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

  if (name === "get_kanban_tasks") {
    const user = await prisma.user.findUnique({ where: { email: String(args.userEmail) } });
    if (!user) throw new Error("User not found");

    const tasks = await prisma.kanbanTask.findMany({
      where: { userId: user.id }
    });
    
    return {
      content: [{ type: "text", text: JSON.stringify(tasks, null, 2) }]
    };
  }

  if (name === "add_kanban_task") {
    const user = await prisma.user.findUnique({ where: { email: String(args.userEmail) } });
    if (!user) throw new Error("User not found");

    const task = await prisma.kanbanTask.create({
      data: {
        userId: user.id,
        title: String(args.title),
        status: "todo"
      }
    });
    
    return {
      content: [{ type: "text", text: JSON.stringify(task, null, 2) }]
    };
  }

  if (name === "update_kanban_status") {
    const user = await prisma.user.findUnique({ where: { email: String(args.userEmail) } });
    if (!user) throw new Error("User not found");

    const task = await prisma.kanbanTask.update({
      where: { id: String(args.taskId) },
      data: {
        status: String(args.status)
      }
    });
    
    return {
      content: [{ type: "text", text: JSON.stringify(task, null, 2) }]
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
