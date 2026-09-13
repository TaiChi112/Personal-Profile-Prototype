"use server";

import { auth } from "@/auth";
import { LedgerRepository } from "@/lib/repositories/ledger.repository";
import { revalidatePath } from "next/cache";

export async function getRecords() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return LedgerRepository.getRecords(session.user.id);
}

export async function addRecord(name: string, item: string, date: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const result = await LedgerRepository.addRecord(session.user.id, name, item, date);
  revalidatePath("/projects/lend-ledger");
  return result;
}

export async function toggleReturn(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const result = await LedgerRepository.toggleReturn(session.user.id, id);
  revalidatePath("/projects/lend-ledger");
  return result;
}

export async function deleteRecord(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const result = await LedgerRepository.deleteRecord(session.user.id, id);
  revalidatePath("/projects/lend-ledger");
  return result;
}
