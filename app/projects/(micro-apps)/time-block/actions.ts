'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { addTimeBlock, deleteTimeBlock } from '@/lib/repositories/timeblock.repository';

export async function addTimeBlockAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const title = formData.get('title') as string;
  const start = formData.get('start') as string;
  const end = formData.get('end') as string;
  const color = formData.get('color') as string || '#6366F1';

  if (!title || !start || !end) return;

  await addTimeBlock({
    userId: session.user.id,
    title,
    start,
    end,
    color,
  });

  revalidatePath('/projects/time-block');
}

export async function deleteTimeBlockAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await deleteTimeBlock(id, session.user.id);

  revalidatePath('/projects/time-block');
}
