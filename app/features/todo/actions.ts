"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma"; // Adjust this based on where prisma is

export async function syncTodosToCloud(localTodos: { id: string; text: string; completed: boolean; createdAt: string }[]) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // We could implement this as an upsert or full sync.
  // Assuming a simple sync where we push new ones or update existing ones.
  // Actually, a simpler approach is a transaction:
  const operations = localTodos.map((todo) => {
    return prisma.todo.upsert({
      where: {
        id: todo.id,
      },
      update: {
        text: todo.text,
        completed: todo.completed,
      },
      create: {
        id: todo.id,
        userId: userId,
        text: todo.text,
        completed: todo.completed,
        createdAt: new Date(todo.createdAt),
      },
    });
  });

  await prisma.$transaction(operations);

  return { success: true };
}

export async function fetchCloudTodos() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const todos = await prisma.todo.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return todos.map((t) => ({
    id: t.id,
    text: t.text,
    completed: t.completed,
    createdAt: t.createdAt.toISOString(),
  }));
}
