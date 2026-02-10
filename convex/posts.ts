import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('posts')
      .withIndex('by_created')
      .order('desc')
      .collect();
  },
});

export const get = query({
  args: { id: v.id('posts') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    status: v.union(
      v.literal('draft'),
      v.literal('generating'),
      v.literal('published'),
    ),
    generatedBy: v.string(),
    domain: v.string(),
    topic: v.string(),
    wordCount: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('posts', {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id('posts'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal('draft'),
        v.literal('generating'),
        v.literal('published'),
      ),
    ),
    wordCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, {
      ...fields,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id('posts') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
