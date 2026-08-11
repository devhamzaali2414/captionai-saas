'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please enter both email and password.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signupAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const practiceName = (formData.get('practiceName') as string) || '';

  if (!email || !password) {
    return { error: 'Please provide all required fields.' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        practice_name: practiceName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Pre-seed a default PracticeProfile for this user if signup is immediate
  if (data.user) {
    try {
      const existingProfile = await prisma.practiceProfile.findFirst({
        where: { userId: data.user.id },
      });
      if (!existingProfile) {
        await prisma.practiceProfile.create({
          data: {
            userId: data.user.id,
            name: practiceName || 'My Practice',
          },
        });
      }
    } catch (dbErr) {
      console.warn('Could not auto-create profile on signup:', dbErr);
    }
  }

  // If Supabase has email confirmation enabled, session might be null
  if (data.session === null && data.user && data.user.identities?.length) {
    return { success: true, message: 'Please check your email to confirm your account.' };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
