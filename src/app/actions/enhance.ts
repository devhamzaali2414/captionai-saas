'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import OpenAI from 'openai';

async function getUserId(): Promise<string> {
  const user = await getCurrentUser();
  return user?.id || 'default-user';
}

const DEFAULT_HASHTAGS_MAP: Record<string, string[]> = {
  dental: ['#DentalCare', '#HealthySmile', '#DentistTips', '#SmileMakeover', '#OralHealth', '#CosmeticDentistry', '#TeethWhitening', '#Invisalign'],
  orthodontics: ['#BracesLife', '#InvisalignSmile', '#Orthodontist', '#StraightTeeth', '#SmileTransformation', '#ConfidentSmile'],
  medical: ['#HealthcareTips', '#DoctorAdvice', '#PatientCare', '#HealthyLiving', '#WellnessJourney', '#PreventativeCare'],
  dermatology: ['#SkinCareTips', '#HealthySkin', '#Dermatologist', '#GlowUp', '#SkinHealth', '#MedicalAesthetics'],
  general: ['#PracticeUpdates', '#DoctorCare', '#HealthAndWellness', '#PatientFirst', '#LocalClinic', '#CommunityHealth'],
};

export async function enhanceDraftWithHashtags(draftId: number) {
  const userId = await getUserId();
  const draft = await prisma.captionDraft.findFirst({
    where: { id: draftId, userId },
  });

  if (!draft) return { error: 'Draft not found' };

  const profile = await prisma.practiceProfile.findFirst({
    where: { userId },
  });

  let newHashtags = '';

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '') {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = `
Generate 6 to 8 trending, highly relevant Instagram/Facebook hashtags for this social media post for a ${profile?.specialty || 'medical/dental'} practice (${profile?.name || 'Local Practice'}).
Caption: "${draft.content}"

Output ONLY the hashtags separated by spaces (e.g. #HealthySmile #DentalCare #AustinDentist). Do not include any other text.
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      newHashtags = response.choices[0]?.message?.content?.trim() || '';
    } catch (e) {
      console.warn('OpenAI hashtag generation error, using fallback:', e);
    }
  }

  if (!newHashtags) {
    const specialtyLower = (profile?.specialty || '').toLowerCase();
    let tagList = DEFAULT_HASHTAGS_MAP.general;
    if (specialtyLower.includes('ortho') || specialtyLower.includes('brace')) {
      tagList = DEFAULT_HASHTAGS_MAP.orthodontics;
    } else if (specialtyLower.includes('dent') || specialtyLower.includes('tooth') || specialtyLower.includes('teeth')) {
      tagList = DEFAULT_HASHTAGS_MAP.dental;
    } else if (specialtyLower.includes('derma') || specialtyLower.includes('skin')) {
      tagList = DEFAULT_HASHTAGS_MAP.dermatology;
    } else {
      tagList = DEFAULT_HASHTAGS_MAP.medical;
    }

    if (profile?.name) {
      const practiceTag = '#' + profile.name.replace(/[^a-zA-Z0-9]/g, '');
      tagList = [practiceTag, ...tagList];
    }
    newHashtags = tagList.slice(0, 7).join(' ');
  }

  // Update draft
  const updatedContent = draft.content.includes('#') 
    ? draft.content + '\n\n' + newHashtags 
    : draft.content + '\n\n' + newHashtags;

  await prisma.captionDraft.updateMany({
    where: { id: draftId, userId },
    data: {
      content: updatedContent,
      hashtags: newHashtags,
    },
  });

  revalidatePath('/drafts');
  return { success: true, hashtags: newHashtags, updatedContent };
}

export async function updateDraftContent(draftId: number, content: string) {
  const userId = await getUserId();
  await prisma.captionDraft.updateMany({
    where: { id: draftId, userId },
    data: { content: content.trim() },
  });
  revalidatePath('/drafts');
  return { success: true };
}

export async function attachImageToDraft(draftId: number, imagePath: string) {
  const userId = await getUserId();
  await prisma.captionDraft.updateMany({
    where: { id: draftId, userId },
    data: { imagePath },
  });
  revalidatePath('/drafts');
  return { success: true };
}

export async function removeImageFromDraft(draftId: number) {
  const userId = await getUserId();
  await prisma.captionDraft.updateMany({
    where: { id: draftId, userId },
    data: { imagePath: null },
  });
  revalidatePath('/drafts');
  return { success: true };
}
