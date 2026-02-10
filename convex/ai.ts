'use node';

import OpenAI from 'openai';
import { v } from 'convex/values';
import { action } from './_generated/server';
import { api } from './_generated/api';

const getClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY not set. Run: npx convex env set OPENAI_API_KEY <key>',
    );
  }
  return new OpenAI({ apiKey });
};

const extractText = (response: OpenAI.Responses.Response): string => {
  const textItems = response.output.filter(
    (item): item is OpenAI.Responses.ResponseOutputMessage =>
      item.type === 'message',
  );
  return textItems
    .flatMap((item) =>
      item.content
        .filter(
          (c): c is OpenAI.Responses.ResponseOutputText =>
            c.type === 'output_text',
        )
        .map((c) => c.text),
    )
    .join('\n')
    .trim();
};

export const findTrendingTopics = action({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    const client = getClient();

    const response = await client.responses.create({
      model: 'gpt-4o',
      tools: [{ type: 'web_search_preview' }],
      input: `Find 5 trending topics in the "${args.domain}" domain that would make great blog posts right now. Use web search to find current trends, popular discussions, and emerging topics.

      Return ONLY a JSON array with exactly 5 objects, each having:
      - "name": the topic title (concise, blog-post-ready)
      - "searchVolume": estimated relative search interest ("high", "medium", or "rising")
      - "trend": brief trend description (e.g., "Growing 40% month-over-month")
      - "reason": why this topic is trending now (1 sentence)

      Return ONLY the JSON array, no markdown fences or other text.`,
    });

    let jsonText = extractText(response);
    const fenceMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      jsonText = fenceMatch[1].trim();
    }

    const topics = JSON.parse(jsonText);
    if (!Array.isArray(topics) || topics.length === 0) {
      throw new Error('Invalid topics response');
    }

    await ctx.runMutation(api.topics.createBatch, {
      domain: args.domain,
      topics,
    });

    return topics;
  },
});

export const generatePost = action({
  args: { topic: v.string(), domain: v.string() },
  handler: async (
    ctx,
    args,
  ): Promise<{
    _id: string;
    title: string;
    content: string;
    wordCount: number;
  }> => {
    const client = getClient();

    // Research the topic
    const researchResponse = await client.responses.create({
      model: 'gpt-4o',
      tools: [{ type: 'web_search_preview' }],
      input: `Research the topic "${args.topic}" in the "${args.domain}" domain. Use web search to find:
      - Key facts and statistics
      - Recent developments
      - Expert opinions
      - Practical examples

      Provide a comprehensive research summary with sources.`,
    });

    const research = extractText(researchResponse);

    // Write the blog post
    const writeResponse = await client.responses.create({
      model: 'gpt-4o',
      input: `Using this research, write a comprehensive blog post:

      Research:
      ${research}

      Requirements:
      - Topic: "${args.topic}"
      - Domain: "${args.domain}"
      - Length: 2000+ words
      - Format: Markdown
      - Include: engaging introduction, clear headings (##), practical examples, statistics where relevant, actionable conclusion
      - Tone: professional but accessible
      - Do NOT include a title heading (it will be added separately)

      Write the blog post now.`,
    });

    const content = extractText(writeResponse);
    if (!content) {
      throw new Error('No content generated');
    }

    const wordCount = content.split(/\s+/).filter(Boolean).length;

    // Generate a title
    const titleResponse = await client.responses.create({
      model: 'gpt-4o',
      input: `Generate a single compelling blog post title for this content about "${args.topic}". Return ONLY the title text, nothing else.`,
    });

    const titleText = extractText(titleResponse);
    const title = titleText
      ? titleText.replace(/^["']|["']$/g, '')
      : args.topic;

    // Save to database
    const postId = await ctx.runMutation(api.posts.create, {
      title,
      content,
      status: 'published',
      generatedBy: 'ai',
      domain: args.domain,
      topic: args.topic,
      wordCount,
    });

    return { _id: postId, title, content, wordCount };
  },
});
