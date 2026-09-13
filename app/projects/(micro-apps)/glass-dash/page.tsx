import { auth } from "@/auth";
import { FinanceRepository } from "@/lib/repositories/finance.repository";
import { KanbanRepository } from "@/lib/repositories/kanban.repository";
import DashboardView from "./components/DashboardView";
import prisma from "@/lib/prisma";

export default async function GlassDashPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return <div>Please login</div>;
  }

  const userId = session.user.id;

  const [kanbanTasks, transactions] = await Promise.all([
    KanbanRepository.getTasks(userId),
    prisma.financeTransaction.findMany({ where: { userId } }),
  ]);

  return (
    <DashboardView transactions={transactions} tasks={kanbanTasks} />
  );
}
