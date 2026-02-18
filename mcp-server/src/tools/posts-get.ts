import { z } from 'zod';
import { type InferSchema, type ToolMetadata } from 'xmcp';
import { getPost } from '../lib/convex-client';
import { requireSessionUserId } from '../lib/clerk-session';

export const schema = {
  postId: z.string().min(1),
};

export const metadata: ToolMetadata = {
  name: 'posts_get',
  description: 'Get a single post by id for the authenticated user.',
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    destructiveHint: false,
  },
};

export default async function postsGetTool({
  postId,
}: InferSchema<typeof schema>) {
  const userId = await requireSessionUserId();
  const post = await getPost({ userId, postId });
  if (!post) {
    throw new Error('Post not found');
  }
  return {
    content: [
      {
        type: 'text' as const,
        text: `Loaded post: ${post.title}`,
      },
      {
        // Fallback for clients/proxies that ignore structuredContent.
        type: 'text' as const,
        text: JSON.stringify(post),
      },
    ],
    structuredContent: post,
  };
}
