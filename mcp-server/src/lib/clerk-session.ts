import { getSession, getUser } from '@xmcp-dev/clerk';

export const requireSessionUserId = async (): Promise<string> => {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error('Unauthorized: no active Clerk session.');
  }
  return session.userId;
};

export const getSessionUser = async () => {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error('Unauthorized: no active Clerk session.');
  }

  const user = await getUser();
  return { session, user };
};
