'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function getUserId(): Promise<string> {
  const user = await getCurrentUser();
  return user?.id || 'default-user';
}

export async function getAllClinics() {
  const userId = await getUserId();
  let clinics = await prisma.practiceProfile.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });

  if (clinics.length === 0) {
    const defaultClinic = await prisma.practiceProfile.create({
      data: {
        userId,
        name: 'Main Practice Clinic',
        specialty: 'Dental & Healthcare',
        isCurrent: true,
      },
    });
    return [defaultClinic];
  }

  return clinics;
}

export async function switchCurrentClinic(clinicId: number) {
  const userId = await getUserId();

  // Reset current flag
  await prisma.practiceProfile.updateMany({
    where: { userId },
    data: { isCurrent: false },
  });

  // Set new active clinic
  await prisma.practiceProfile.update({
    where: { id: clinicId },
    data: { isCurrent: true },
  });

  revalidatePath('/', 'layout');
}

export async function createNewClinic(formData: FormData) {
  const userId = await getUserId();
  const name = (formData.get('name') as string) || 'New Clinic';
  const specialty = (formData.get('specialty') as string) || 'General Practice';
  const location = (formData.get('location') as string) || '';

  // Unset previous active
  await prisma.practiceProfile.updateMany({
    where: { userId },
    data: { isCurrent: false },
  });

  const newClinic = await prisma.practiceProfile.create({
    data: {
      userId,
      name,
      specialty,
      location,
      isCurrent: true,
    },
  });

  revalidatePath('/', 'layout');
  return newClinic;
}
