import { type InferSchema, type ToolMetadata } from 'xmcp';
import { authWhoAmI } from '../lib/convex-client';
import { getSessionUser } from '../lib/clerk-session';
import { toToolResult } from '../lib/tool-result';

export const schema = {};

export const metadata: ToolMetadata = {
  name: 'auth_whoami',
  description: 'Return authenticated MCP user identity.',
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    destructiveHint: false,
  },
};

export default async function authWhoAmITool(_: InferSchema<typeof schema>) {
  const { session, user } = await getSessionUser();
  const identity = await authWhoAmI(session.userId);

  return toToolResult(
    {
      ...identity,
      sessionId: session.sessionId,
      email: user?.primaryEmailAddress?.emailAddress,
    },
    'Authenticated user resolved.',
  );
}
