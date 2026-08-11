'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function getUserId(): Promise<string> {
  const user = await getCurrentUser();
  return user?.id || 'default-user';
}

export async function getProfile() {
  const userId = await getUserId();
  let profile = await prisma.practiceProfile.findFirst({
    where: { userId },
  });

  if (!profile) {
    profile = await prisma.practiceProfile.create({
      data: { userId },
    });
  }

  return profile;
}

export async function updateProfile(formData: FormData) {
  const userId = await getUserId();
  const name = (formData.get('name') as string) || '';
  const specialty = (formData.get('specialty') as string) || '';
  const location = (formData.get('location') as string) || '';
  const preferredTopics = (formData.get('preferredTopics') as string) || '';
  const tone = (formData.get('tone') as string) || '';
  const voiceSamples = (formData.get('voiceSamples') as string) || '';

  const profile = await prisma.practiceProfile.findFirst({
    where: { userId },
  });

  if (profile) {
    await prisma.practiceProfile.update({
      where: { id: profile.id },
      data: { name, specialty, location, preferredTopics, tone, voiceSamples },
    });
  } else {
    await prisma.practiceProfile.create({
      data: { userId, name, specialty, location, preferredTopics, tone, voiceSamples },
    });
  }

  revalidatePath('/profile');
}

export async function savePostizApiKey(formData: FormData) {
  const userId = await getUserId();
  const postizApiKey = (formData.get('postizApiKey') as string) || '';
  const profile = await prisma.practiceProfile.findFirst({
    where: { userId },
  });

  if (profile) {
    await prisma.practiceProfile.update({
      where: { id: profile.id },
      data: { postizApiKey },
    });
  } else {
    await prisma.practiceProfile.create({
      data: { userId, postizApiKey },
    });
  }

  revalidatePath('/settings');
}
