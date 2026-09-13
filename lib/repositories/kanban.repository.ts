import { prisma } from "../prisma";

export class KanbanRepository {
  static async getTasks(userId: string) {
    return prisma.kanbanTask.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
  }

  static async addTask(userId: string, title: string) {
    return prisma.kanbanTask.create({
      data: {
        userId,
        title,
        status: "todo",
      },
    });
  }

  static async updateTaskStatus(userId: string, id: string, status: string) {
    return prisma.kanbanTask.update({
      where: { id, userId },
      data: { status },
    });
  }

  static async deleteTask(userId: string, id: string) {
    return prisma.kanbanTask.delete({
      where: { id, userId },
    });
  }
}
