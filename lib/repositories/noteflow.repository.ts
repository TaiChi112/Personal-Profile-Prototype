import { prisma } from "../prisma";

export class NoteFlowRepository {
  static async getNotes(userId: string) {
    return prisma.note.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  static async addNote(userId: string, title: string, content: string) {
    return prisma.note.create({
      data: { userId, title, content },
    });
  }

  static async updateNote(userId: string, noteId: string, content: string, title: string) {
    return prisma.note.update({
      where: { id: noteId, userId },
      data: { content, title },
    });
  }

  static async deleteNote(userId: string, noteId: string) {
    return prisma.note.delete({
      where: { id: noteId, userId },
    });
  }
}
