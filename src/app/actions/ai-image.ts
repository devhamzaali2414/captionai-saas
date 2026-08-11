'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import OpenAI from 'openai';

async function getUserId(): Promise<string> {
  const user = await getCurrentUser();
  return user?.id || 'default-user';
}

const PRESET_IMAGE_LIBRARY: Record<string, string[]> = {
  'clinic-minimal': [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=900&auto=format&fit=crop&q=80',
  ],
  'smile-transformation': [
    'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=900&auto=format&fit=crop&q=80',
  ],
  'doctor-advice': [
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&auto=format&fit=crop&q=80',
  ],
  'promo-special': [
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=900&auto=format&fit=crop&q=80',
  ],
};

export async function generateAIImageForDraft(draftId: number, style: string = 'clinic-minimal', customPrompt?: string) {
  const userId = await getUserId();
  const draft = await prisma.captionDraft.findFirst({
    where: { id: draftId, userId },
  });

  if (!draft) return { error: 'Draft not found' };

  let imageUrl = '';

  // If OpenAI API Key is present, we can generate via DALL-E 3
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '') {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = customPrompt || `Professional aesthetic social media graphic for a modern healthcare clinic. Context: "${draft.content.substring(0, 120)}". Clean lighting, modern medical setting, welcoming and friendly atmosphere.`;

      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      });

      imageUrl = response.data?.[0]?.url || '';
    } catch (e) {
      console.warn('DALL-E generation error, using curated high-res library fallback:', e);
    }
  }

  // High-res curated fallback based on selected style preset
  if (!imageUrl) {
    const list = PRESET_IMAGE_LIBRARY[style] || PRESET_IMAGE_LIBRARY['clinic-minimal'];
    imageUrl = list[Math.floor(Math.random() * list.length)];
  }

  // Update draft with image
  await prisma.captionDraft.updateMany({
    where: { id: draftId, userId },
    data: { imagePath: imageUrl },
  });

  revalidatePath('/drafts');
  return { success: true, imageUrl };
}
