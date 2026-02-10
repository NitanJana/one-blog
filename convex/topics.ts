import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('topics')
      .withIndex('by_created')
      .order('desc')
      .collect();
  },
});

export const recentDomains = query({
  args: {},
  handler: async (ctx) => {
    const topics = await ctx.db
      .query('topics')
      .withIndex('by_created')
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
    return await ctx.db
      .query('topics')
      .withIndex('by_domain', (q) => q.eq('domain', args.domain))
      .collect();
  },
});

export const createBatch = mutation({
  args: {
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
    const now = Date.now();
    for (const topic of args.topics) {
      await ctx.db.insert('topics', {
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
