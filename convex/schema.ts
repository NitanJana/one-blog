import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  topics: defineTable({
    domain: v.string(),
    name: v.string(),
    searchVolume: v.string(),
    trend: v.string(),
    reason: v.string(),
    createdAt: v.number(),
  })
    .index('by_domain', ['domain'])
    .index('by_created', ['createdAt']),
  posts: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_status', ['status'])
    .index('by_created', ['createdAt']),
});
