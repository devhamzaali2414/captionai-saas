'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function getUserId(): Promise<string> {
  const user = await getCurrentUser();
  return user?.id || 'default-user';
}

export async function getUserSubscription() {
  const userId = await getUserId();
  try {
    if ((prisma as any)?.subscription) {
      let sub = await (prisma as any).subscription.findUnique({
        where: { userId },
      });

      if (!sub) {
        sub = await (prisma as any).subscription.create({
          data: {
            userId,
            plan: 'free',
            creditsUsed: 4,
            monthlyLimit: 25,
            status: 'active',
          },
        });
      }
      return sub;
    }
  } catch (err) {
    console.warn('Error reading subscription, using fallback:', err);
  }

  return {
    id: 1,
    userId,
    plan: 'free',
    creditsUsed: 4,
    monthlyLimit: 25,
    status: 'active',
  };
}

export async function upgradeSubscriptionPlan(planName: 'pro' | 'agency') {
  const userId = await getUserId();
  const limit = planName === 'agency' ? 500 : 150;

  try {
    if ((prisma as any)?.subscription) {
      const sub = await (prisma as any).subscription.upsert({
        where: { userId },
        update: {
          plan: planName,
          monthlyLimit: limit,
          status: 'active',
        },
        create: {
          userId,
          plan: planName,
          monthlyLimit: limit,
          creditsUsed: 0,
          status: 'active',
        },
      });

      revalidatePath('/pricing');
      revalidatePath('/dashboard');
      return sub;
    }
  } catch (err) {
    console.warn('Error upgrading subscription:', err);
  }

  return {
    id: 1,
    userId,
    plan: planName,
    monthlyLimit: limit,
    creditsUsed: 0,
    status: 'active',
  };
}
