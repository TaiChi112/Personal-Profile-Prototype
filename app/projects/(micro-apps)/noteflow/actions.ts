"use server";
import { auth } from "@/auth";
import { NoteFlowRepository } from "@/lib/repositories/noteflow.repository";
import { revalidatePath } from "next/cache";

export async function addNoteAction(title: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await NoteFlowRepository.addNote(session.user.id, title, content);
  revalidatePath("/projects/noteflow");
}

export async function updateNoteAction(noteId: string, content: string, title: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await NoteFlowRepository.updateNote(session.user.id, noteId, content, title);
  revalidatePath("/projects/noteflow");
}

export async function deleteNoteAction(noteId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await NoteFlowRepository.deleteNote(session.user.id, noteId);
  revalidatePath("/projects/noteflow");
}
