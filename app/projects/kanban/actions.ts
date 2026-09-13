"use server";

import { auth } from "@/auth";
import { KanbanRepository } from "@/lib/repositories/kanban.repository";
import { revalidatePath } from "next/cache";

export async function getKanbanTasks() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return KanbanRepository.getTasks(session.user.id);
}

export async function addKanbanTask(title: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const result = await KanbanRepository.addTask(session.user.id, title);
  revalidatePath("/projects/kanban");
  return result;
}

export async function updateKanbanTask(id: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const result = await KanbanRepository.updateTask(session.user.id, id, status);
  revalidatePath("/projects/kanban");
  return result;
}

export async function deleteKanbanTask(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const result = await KanbanRepository.deleteTask(session.user.id, id);
  revalidatePath("/projects/kanban");
  return result;
}
