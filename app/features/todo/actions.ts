"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTodos() {
  const session = await auth();
  const userId = session?.user?.id || 'user_1';

  const todos = await prisma.todo.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return todos;
}

export async function addTodo(text: string) {
  const session = await auth();
  const userId = session?.user?.id || 'user_1';

  if (!text.trim()) return { error: "Text is required" };

  await prisma.todo.create({
    data: {
      userId: userId,
      text: text.trim(),
      completed: false,
    },
  });

  revalidatePath('/projects/(micro-apps)/todo');
  return { success: true };
}

export async function toggleTodo(id: string, completed: boolean) {
  const session = await auth();
  const userId = session?.user?.id || 'user_1';

  await prisma.todo.update({
    where: {
      id: id,
      userId: userId, // Ensure ownership
    },
    data: {
      completed: completed,
    },
  });

  revalidatePath('/projects/(micro-apps)/todo');
  return { success: true };
}

export async function deleteTodo(id: string) {
  const session = await auth();
  const userId = session?.user?.id || 'user_1';

  await prisma.todo.delete({
    where: {
      id: id,
      userId: userId, // Ensure ownership
    },
  });

  revalidatePath('/projects/(micro-apps)/todo');
  return { success: true };
}
