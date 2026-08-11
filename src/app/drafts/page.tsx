import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/supabase/server';
import { getPostizIntegrations } from '@/app/actions/postiz';
import DraftsClient from './DraftsClient';

export default async function DraftsPage() {
  const user = await getCurrentUser();
  const userId = user?.id || 'default-user';

  const drafts = await prisma.captionDraft.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  const integrations = await getPostizIntegrations();

  return <DraftsClient initialDrafts={drafts} integrations={integrations} />;
}
