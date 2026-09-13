import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { prisma } from "../lib/prisma";

describe("FinanceFlow MCP Server", () => {
  let client: Client;
  let transport: StdioClientTransport;
  const testEmail = "mcp-test@test.com";
  let kanbanTaskId: string;

  beforeAll(async () => {
    // Clean up and setup dummy user
    await prisma.kanbanTask.deleteMany({ where: { user: { email: testEmail } } });
    await prisma.financeTransaction.deleteMany({ where: { user: { email: testEmail } } });
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.user.create({ data: { id: "mcp-user-id", email: testEmail } });

    // Start MCP Server Client
    transport = new StdioClientTransport({
      command: "bun",
      args: ["run", "mcp-server.ts"]
    });
    client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });
    await client.connect(transport);
  });

  afterAll(async () => {
    // Cleanup DB
    await prisma.kanbanTask.deleteMany({ where: { user: { email: testEmail } } });
    await prisma.financeTransaction.deleteMany({ where: { user: { email: testEmail } } });
    await prisma.user.deleteMany({ where: { email: testEmail } });
    // Close MCP Client
    if (transport) await transport.close();
  });

  it("should list available tools", async () => {
    const toolsResult = await client.listTools();
    const toolNames = toolsResult.tools.map(t => t.name);
    expect(toolNames).toContain("get_financial_summary");
    expect(toolNames).toContain("add_transaction");
    expect(toolNames).toContain("add_kanban_task");
    expect(toolNames).toContain("get_kanban_tasks");
    expect(toolNames).toContain("update_kanban_status");
  });

  it("should add a transaction via MCP tool", async () => {
    const result = await client.callTool({
      name: "add_transaction",
      arguments: {
        userEmail: testEmail,
        amount: 500,
        label: "Groceries",
        type: "expense"
      }
    });

    expect(result.content[0].type).toBe("text");
    const parsed = JSON.parse(result.content[0].text as string);
    expect(parsed.amount).toBe(500);
    expect(parsed.label).toBe("Groceries");
  });

  it("should get financial summary via MCP tool", async () => {
    const result = await client.callTool({
      name: "get_financial_summary",
      arguments: { userEmail: testEmail }
    });

    expect(result.content[0].type).toBe("text");
    const parsed = JSON.parse(result.content[0].text as string);
    
    const groceries = parsed.find((p: any) => p.label === "Groceries");
    expect(groceries).toBeDefined();
    expect(groceries._sum.amount).toBe(500);
  });

  it("should add a kanban task via MCP tool", async () => {
    const result = await client.callTool({
      name: "add_kanban_task",
      arguments: {
        userEmail: testEmail,
        title: "Test Kanban Task",
        status: "todo"
      }
    });

    expect(result.content[0].type).toBe("text");
    const parsed = JSON.parse(result.content[0].text as string);
    expect(parsed.title).toBe("Test Kanban Task");
    expect(parsed.status).toBe("todo");
    kanbanTaskId = parsed.id;
  });

  it("should get kanban tasks via MCP tool", async () => {
    const result = await client.callTool({
      name: "get_kanban_tasks",
      arguments: { userEmail: testEmail }
    });

    expect(result.content[0].type).toBe("text");
    const parsed = JSON.parse(result.content[0].text as string);
    const task = parsed.find((t: any) => t.id === kanbanTaskId);
    expect(task).toBeDefined();
    expect(task.title).toBe("Test Kanban Task");
  });

  it("should update kanban task status via MCP tool", async () => {
    const result = await client.callTool({
      name: "update_kanban_status",
      arguments: {
        userEmail: testEmail, taskId: kanbanTaskId,
        status: "in-progress"
      }
    });

    expect(result.content[0].type).toBe("text");
    const parsed = JSON.parse(result.content[0].text as string);
    expect(parsed.id).toBe(kanbanTaskId);
    expect(parsed.status).toBe("in-progress");
  });
});
