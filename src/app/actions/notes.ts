'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function getUserId(): Promise<string> {
  const user = await getCurrentUser();
  return user?.id || 'default-user';
}

export async function getNotes() {
  const userId = await getUserId();
  return await prisma.note.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function addNote(formData: FormData) {
  const userId = await getUserId();
  const content = formData.get('content') as string;
  if (!content || content.trim() === '') return;

  await prisma.note.create({
    data: {
      userId,
      content: content.trim(),
    },
  });

  revalidatePath('/notes');
}

export async function deleteNote(id: number) {
  const userId = await getUserId();
  // Ensure user only deletes their own note
  await prisma.note.deleteMany({
    where: { id, userId },
  });
  revalidatePath('/notes');
}
