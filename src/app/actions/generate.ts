'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import OpenAI from 'openai';

async function getUserId(): Promise<string> {
  const user = await getCurrentUser();
  return user?.id || 'default-user';
}

function generateMockCaptions(
  practiceName: string,
  specialty: string,
  topic: string,
  quantity: number
): string[] {
  const practice = practiceName || 'our practice';
  const field = specialty || 'healthcare';
  const subject = topic || 'healthy smiles and patient care';

  const mockTemplates = [
    `✨ A quick update from the team at ${practice}!

When it comes to ${subject}, small consistent habits make the biggest difference. Whether you're due for a routine checkup or looking to refresh your care routine, our team is here for you every step of the way. 

Drop a comment below or send us a message to schedule your next visit! 👇 #HealthCare #${field.replace(/\s+/g, '')} #PatientCare #${practice.replace(/\s+/g, '')}`,

    `Did you know? 🤔 

Taking care of ${subject} isn't just about feeling great today—it's an investment in your long-term wellness. At ${practice}, we believe in personalized, gentle care designed specifically for your goals.

Have questions about your treatment plan? Reach out to our friendly team today! 💬✨ #${field.replace(/\s+/g, '')} #WellnessTips #HealthyHabits`,

    `Behind the scenes at ${practice}! 🩺💙

Our passion is helping our patients feel confident, informed, and comfortable. Today, we're focusing on ${subject} and making sure everyone leaves with a smile.

What's one wellness goal you're working on this month? Let us know in the comments! 🌟`,

    `Friendly reminder from ${practice}: 📅

Your health and comfort always come first. If it's been a while since your last consultation regarding ${subject}, now is the perfect time to book.

Call us today or visit the link in our bio to reserve your spot! 📲 #${field.replace(/\s+/g, '')}Tips #DoctorAdvice`,

    `Myth vs. Fact! 💡

Myth: Taking care of ${subject} has to be complicated.
Fact: With modern techniques and the right team, it's easier and more comfortable than ever.

Learn more about how we personalize care at ${practice} by clicking the link in our bio! 🚀`
  ];

  const results: string[] = [];
  for (let i = 0; i < quantity; i++) {
    results.push(mockTemplates[i % mockTemplates.length]);
  }
  return results;
}

export async function generateCaptions(formData: FormData) {
  const topic = (formData.get('topic') as string) || '';
  const quantity = parseInt(formData.get('quantity') as string, 10) || 3;
  
  const userId = await getUserId();

  let profile = await prisma.practiceProfile.findFirst({
    where: { userId },
  });

  if (!profile) {
    profile = await prisma.practiceProfile.create({
      data: { userId },
    });
  }

  let generatedCaptions: string[] = [];

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '') {
    // Get the latest 15 notes for this user's practice
    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 15,
    });
    
    const notesContext = notes.length > 0 
      ? notes.map(n => `- ${n.content}`).join('\n')
      : 'No specific practice notes provided yet.';

    const systemPrompt = `
You are an expert social media manager writing captions for a medical/dental practice.
Write in the EXACT voice and tone of the doctor/practice based on their profile and voice samples.

PRACTICE INFO:
Name: ${profile.name || 'Our Practice'}
Specialty: ${profile.specialty || 'General Practice'}
Location: ${profile.location || 'Local Clinic'}
Preferred Topics: ${profile.preferredTopics || 'General health, tips, and updates'}
Tone: ${profile.tone || 'Friendly and professional'}

VOICE SAMPLES (MIMIC THIS STYLE):
${profile.voiceSamples || 'Clear, authentic, approachable, patient-centered.'}

RECENT PRACTICE NOTES (USE THESE FOR INSPIRATION/CONTEXT):
${notesContext}

TASK:
Write ${quantity} distinct social media caption(s) about the topic: "${topic || 'Anything relevant from recent notes'}".
Make them sound natural, engaging, and directly from the doctor. DO NOT sound like a generic AI.
Separate each caption with three dashes "---" so they can be parsed easily.
    `;

    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please generate ${quantity} caption(s).` }
        ],
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content || "";
      generatedCaptions = content.split('---').map(c => c.trim()).filter(c => c.length > 0);
    } catch (apiErr) {
      console.warn("OpenAI API error, falling back to smart simulation:", apiErr);
      generatedCaptions = generateMockCaptions(profile.name, profile.specialty, topic, quantity);
    }
  } else {
    // Graceful fallback for testing when no OpenAI key is configured yet
    generatedCaptions = generateMockCaptions(profile.name, profile.specialty, topic, quantity);
  }

  // Save to database as user drafts
  for (const cap of generatedCaptions) {
    await prisma.captionDraft.create({
      data: {
        userId,
        content: cap,
        status: 'draft',
      },
    });
  }

  revalidatePath('/drafts');
  redirect('/drafts');
}
