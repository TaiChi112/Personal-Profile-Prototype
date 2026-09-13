"use server";
import { auth } from "@/auth";
import { HabitRepository } from "@/lib/repositories/habit.repository";
import { revalidatePath } from "next/cache";

export async function addHabitAction(title: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await HabitRepository.addHabit(session.user.id, title);
  revalidatePath("/projects/habit-rpg");
}

export async function completeHabitAction(habitId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await HabitRepository.completeHabit(session.user.id, habitId);
  revalidatePath("/projects/habit-rpg");
}
