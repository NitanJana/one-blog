import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.db
      .query('topics')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .order('desc')
      .collect();
  },
});

export const recentDomains = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const topics = await ctx.db
      .query('topics')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .order('desc')
      .collect();
    const seen = new Set<string>();
    const domains: string[] = [];
    for (const t of topics) {
      if (!seen.has(t.domain)) {
        seen.add(t.domain);
        domains.push(t.domain);
        if (domains.length >= 5) break;
      }
    }
    return domains;
  },
});

export const listByDomain = query({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.db
      .query('topics')
      .withIndex('by_user_domain', (q) =>
        q.eq('userId', identity.subject).eq('domain', args.domain),
      )
      .collect();
  },
});

export const createBatch = mutation({
  args: {
    userId: v.string(),
    domain: v.string(),
    topics: v.array(
      v.object({
        name: v.string(),
        searchVolume: v.string(),
        trend: v.string(),
        reason: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.userId) {
      throw new Error('Unauthorized');
    }

    const now = Date.now();
    for (const topic of args.topics) {
      await ctx.db.insert('topics', {
        userId: args.userId,
        domain: args.domain,
        name: topic.name,
        searchVolume: topic.searchVolume,
        trend: topic.trend,
        reason: topic.reason,
        createdAt: now,
      });
    }
  },
});
