'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function getUserId(): Promise<string> {
  const user = await getCurrentUser();
  return user?.id || 'default-user';
}

const MOCK_INTEGRATIONS = [
  { id: 'mock-ig-1', name: 'Dr. Practice Instagram', provider: 'instagram' },
  { id: 'mock-fb-1', name: 'Practice Facebook', provider: 'facebook' },
];

export async function getPostizIntegrations() {
  const userId = await getUserId();
  const profile = await prisma.practiceProfile.findFirst({
    where: { userId },
  });
  
  const apiKey = profile?.postizApiKey || process.env.BUFFER_API_KEY || process.env.POSTIZ_API_KEY;

  if (!apiKey) {
    return MOCK_INTEGRATIONS;
  }

  // 1. Buffer API (GraphQL)
  if (apiKey.startsWith('tch') || apiKey.startsWith('1/')) {
    try {
      // Step A: Get Organization ID
      const orgRes = await fetch('https://api.buffer.com', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `query { account { organizations { id name } } }`
        })
      });
      const orgData = await orgRes.json();
      const orgId = orgData.data?.account?.organizations?.[0]?.id;

      if (!orgId) {
        console.warn('Buffer account has no organizations, using fallback.');
        return MOCK_INTEGRATIONS;
      }

      // Step B: Get Channels for Organization
      const channelRes = await fetch('https://api.buffer.com', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query GetChannels($input: ChannelsInput!) {
              channels(input: $input) {
                id
                name
                service
                displayName
              }
            }
          `,
          variables: {
            input: { organizationId: orgId }
          }
        })
      });

      const channelData = await channelRes.json();
      const channels = channelData.data?.channels;

      if (channels && Array.isArray(channels) && channels.length > 0) {
        return channels.map((c: any) => ({
          id: c.id,
          name: c.displayName || c.name || 'Social Channel',
          provider: c.service || 'social'
        }));
      }
      return MOCK_INTEGRATIONS;
    } catch (err) {
      console.error('Error fetching Buffer channels:', err);
      return MOCK_INTEGRATIONS;
    }
  }

  // 2. Postiz API
  try {
    const res = await fetch('https://api.postiz.com/public/v1/integrations', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      }
    });

    if (!res.ok) {
      console.warn("Failed to fetch integrations from Postiz, using fallback.");
      return MOCK_INTEGRATIONS;
    }
    
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching integrations:", err);
    return MOCK_INTEGRATIONS;
  }
}

export async function scheduleDraft(formData: FormData) {
  const userId = await getUserId();
  const draftId = parseInt(formData.get('draftId') as string, 10);
  const integrationId = formData.get('integrationId') as string;
  const scheduledDate = formData.get('scheduledDate') as string;

  const profile = await prisma.practiceProfile.findFirst({
    where: { userId },
  });
  const draft = await prisma.captionDraft.findFirst({
    where: { id: draftId, userId },
  });

  if (!draft || !integrationId || !scheduledDate) return;

  const apiKey = profile?.postizApiKey || process.env.BUFFER_API_KEY || process.env.POSTIZ_API_KEY;

  if (apiKey) {
    // 1. Buffer Live Scheduling
    if (apiKey.startsWith('tch') || apiKey.startsWith('1/')) {
      try {
        const isInstagram = true; // Buffer handles service types
        const scheduleIso = new Date(scheduledDate).toISOString();

        const inputPayload: any = {
          channelId: integrationId,
          text: draft.content,
          dueAt: scheduleIso,
          mode: "customScheduled",
          schedulingType: "notification", // Notification mode allows all personal/creator IG accounts
          needsApproval: false
        };

        // If image attached or default image for Instagram
        const imageUrl = draft.imagePath?.startsWith('http') 
          ? draft.imagePath 
          : "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=60";

        inputPayload.metadata = {
          instagram: {
            type: "post",
            shouldShareToFeed: true
          }
        };
        inputPayload.assets = [
          {
            image: { url: imageUrl }
          }
        ];

        let mutation = `
          mutation CreatePost($input: CreatePostInput!) {
            createPost(input: $input) {
              ... on PostActionSuccess {
                post {
                  id
                  status
                }
              }
              ... on MutationError {
                message
              }
            }
          }
        `;

        // 1. Try automatic direct publishing first (works for Business/Creator IG, Facebook, LinkedIn)
        inputPayload.schedulingType = "automatic";
        let bRes = await fetch('https://api.buffer.com', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: mutation,
            variables: { input: inputPayload }
          })
        });

        let bData = await bRes.json();

        // 2. If it requires notification (Personal IG accounts), fallback to notification
        if (bData.data?.createPost?.message?.includes('notification')) {
          inputPayload.schedulingType = "notification";
          bRes = await fetch('https://api.buffer.com', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: mutation,
              variables: { input: inputPayload }
            })
          });
          bData = await bRes.json();
        }

        console.log("Buffer Schedule Final Response:", JSON.stringify(bData));
      } catch (bErr) {
        console.error("Error scheduling with Buffer:", bErr);
      }
    } else {
      // 2. Postiz Live Scheduling
      try {
        await fetch('https://api.postiz.com/public/v1/posts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: "schedule",
            date: new Date(scheduledDate).toISOString(),
            posts: [
              {
                integration: { id: integrationId },
                value: [{ content: draft.content }],
                settings: {} 
              }
            ]
          })
        });
      } catch (e) {
        console.error("Error scheduling with Postiz:", e);
      }
    }
  }

  // Update draft status locally
  await prisma.captionDraft.updateMany({
    where: { id: draftId, userId },
    data: { 
      status: 'scheduled',
      scheduledAt: new Date(scheduledDate)
    }
  });

  revalidatePath('/drafts');
}

export async function deleteDraft(id: number) {
  const userId = await getUserId();
  await prisma.captionDraft.deleteMany({
    where: { id, userId },
  });
  revalidatePath('/drafts');
}
