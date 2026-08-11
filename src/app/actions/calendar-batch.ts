'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import OpenAI from 'openai';

async function getUserId(): Promise<string> {
  const user = await getCurrentUser();
  return user?.id || 'default-user';
}

interface BatchConfig {
  autoSchedule: boolean;
  frequency: 'daily' | 'weekdays' | 'alternate';
  focusTopics: string;
}

const THIRTY_DAYS_TEMPLATES = [
  { category: 'Tip', topic: 'Daily oral hygiene habit' },
  { category: 'Educational', topic: 'How clear aligners straighten teeth without wires' },
  { category: 'Promo', topic: 'Seasonal consultation special offer' },
  { category: 'MythBuster', topic: 'Myth vs Fact: Does teeth whitening damage enamel?' },
  { category: 'BehindTheScenes', topic: 'Meet the team and our sterilization standards' },
  { category: 'PatientCare', topic: 'How we ensure pain-free, comfortable appointments' },
  { category: 'Educational', topic: 'Why flossing is just as important as brushing' },
  { category: 'Tip', topic: 'Best foods for strong teeth and healthy gums' },
  { category: 'Promo', topic: 'Family checkup bundle package' },
  { category: 'MythBuster', topic: 'Is bleeding gums normal when brushing?' },
  { category: 'BehindTheScenes', topic: 'Inside our modern digital scanning technology' },
  { category: 'Educational', topic: 'Signs you might be grinding your teeth at night' },
  { category: 'Tip', topic: 'When to replace your toothbrush' },
  { category: 'PatientCare', topic: 'Overcoming dental anxiety with gentle care' },
  { category: 'Promo', topic: 'New patient welcome special' },
  { category: 'MythBuster', topic: 'Can adults get braces and aligners?' },
  { category: 'BehindTheScenes', topic: 'Morning huddle and preparing for today\'s smiles' },
  { category: 'Educational', topic: 'The difference between plaque and tartar' },
  { category: 'Tip', topic: 'How to maintain a bright smile after coffee/tea' },
  { category: 'PatientCare', topic: 'Patient spotlight & real smile transformation' },
  { category: 'Promo', topic: 'Weekend appointment availability' },
  { category: 'MythBuster', topic: 'Do baby teeth really matter that much?' },
  { category: 'Educational', topic: 'What to do during a dental emergency' },
  { category: 'Tip', topic: 'Drinking water and keeping mouth hydration optimal' },
  { category: 'BehindTheScenes', topic: 'Continuing education and team training day' },
  { category: 'PatientCare', topic: 'How we tailor treatment plans to every budget' },
  { category: 'Promo', topic: 'Teeth whitening promo countdown' },
  { category: 'MythBuster', topic: 'Does sugar cause cavities directly or bacteria?' },
  { category: 'Educational', topic: 'The connection between oral health and heart health' },
  { category: 'Tip', topic: 'End of month reminder: Use your annual insurance benefits!' },
];

export async function generate30DaysCalendar(config: BatchConfig) {
  const userId = await getUserId();
  const profile = await prisma.practiceProfile.findFirst({ where: { userId } });
  const practiceName = profile?.name || 'Our Practice';
  const specialty = profile?.specialty || 'Healthcare Practice';

  const startDate = new Date();
  const createdDrafts = [];

  let dayOffset = 1;

  for (let i = 0; i < 30; i++) {
    const item = THIRTY_DAYS_TEMPLATES[i % THIRTY_DAYS_TEMPLATES.length];
    
    // Calculate scheduled date
    const postDate = new Date();
    postDate.setDate(startDate.getDate() + dayOffset);
    postDate.setHours(11, 30, 0, 0); // Default optimal 11:30 AM slot

    if (config.frequency === 'alternate') {
      dayOffset += 2;
    } else if (config.frequency === 'weekdays') {
      dayOffset += (postDate.getDay() === 5 ? 3 : 1);
    } else {
      dayOffset += 1;
    }

    const captionText = `✨ [${item.category.toUpperCase()}] From ${practiceName}:

${item.topic}! 

At ${practiceName}, our goal is always keeping your smile healthy and confident. Have questions about ${item.topic.toLowerCase()}? Drop a comment below or send us a message to speak with our team! 👇

#${practiceName.replace(/[^a-zA-Z0-9]/g, '')} #${item.category} #${specialty.replace(/[^a-zA-Z0-9]/g, '')} #HealthTips #SmileCare`;

    const draftData: any = {
      userId,
      content: captionText,
      status: config.autoSchedule ? 'scheduled' : 'draft',
      scheduledAt: config.autoSchedule ? postDate : null,
    };

    try {
      const draft = await prisma.captionDraft.create({
        data: {
          ...draftData,
          category: item.category,
        },
      });
      createdDrafts.push(draft);
    } catch {
      const draft = await prisma.captionDraft.create({
        data: draftData,
      });
      createdDrafts.push(draft);
    }
  }

  revalidatePath('/drafts');
  revalidatePath('/dashboard');
  return { success: true, count: createdDrafts.length };
}
