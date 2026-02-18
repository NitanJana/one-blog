# One Blog

Just building something for fun!

<img width="1920" height="1440" alt="product" src="https://github.com/user-attachments/assets/fb181a19-c1c7-4c43-bdaf-88536cda0f12" />

## New Thoughts

- Need a minimal interface to help me improve writing.
- Markdown First -> Solving my need first.
- Focus Mode -> Focus on current sentence and dim the rest.
- Syntax Highlighting -> Help me identify the clutter in my writing.

The MVP would be the above features with markdown export.

## Inspiration

> The artist is a collector. Not a hoarder, mind you, there's a difference: Hoarders collect indiscriminately, artists collect selectively. They only collect things that they really love.
> -Austin Kleon

- [Daylight](https://daylightcomputer.com/): The early inspiration comes from Daylight's distraction free writing mode. I never tried it but looked amazing.
- [iA Writer](https://ia.net/writer): First heard of this from my initial conversation with ChatGPT, then a few more folks from the [Frontend Hire](https://frontendhire.com/) community and reddit suggested this tool. My problem is that it is not web-based.
- [Typora](https://typora.io/): Checked for the alternatives of `iA Writer` and found this. Again, not web-based. But is a more WYSIWYG than `iA Writer`.
- [Obsidian](https://obsidian.md/): I like this tool but never used it as much as I wanted.

The product I want to build:

- Has iA Writer's minimal interface
- Has Typora style WYSIWYG
- Helps build a note taking system like Obsidian
- Exports directly to markdown with YAML data

I am still experimenting and thoughts could change as I build.

## MCP Server (POC)

The repo now includes a remote MCP server scaffold at `mcp-server/` built with
[`xmcp`](https://xmcp.dev/docs), wired to Convex and Clerk-backed user data.

### What it supports

- Clerk-authenticated MCP access via `@xmcp-dev/clerk`
- Trending topics discovery
- AI post generation from topic/domain (blocking flow)
- Post CRUD tools
- Tool contracts include provider fields (`openai_web` now, `gsc` reserved)

### Architecture (modular and swappable)

- MCP tool layer: `mcp-server/src/tools`
- Auth adapter: `mcp-server/src/middleware.ts` + `mcp-server/src/lib/clerk-session.ts`
- Convex data adapter: `mcp-server/src/lib/convex-client.ts`
- Convex MCP bridge functions: `convex/mcp.ts`
- AI provider bridge: `convex/ai.ts` (`openai_web` implemented, `gsc` placeholder)

To swap backend/auth later, keep tool contracts stable and replace adapters.

### Setup

1. Set Convex env vars:

```bash
npx convex env set OPENAI_API_KEY <your-key>
npx convex env set CLERK_JWT_ISSUER_DOMAIN <your-clerk-domain>
npx convex env set MCP_SERVICE_SECRET <long-random-secret>
```

2. Install MCP server deps:

```bash
pnpm --dir mcp-server install
```

3. Configure MCP server env (`mcp-server/.env`):

```bash
MCP_CONVEX_URL=<your-convex-url>
MCP_SERVICE_SECRET=<same-secret-used-in-convex-env>
CLERK_SECRET_KEY=<your-clerk-secret-key>
CLERK_DOMAIN=<your-clerk-domain>
BASE_URL=<public-mcp-server-base-url>
```

4. Run the server:

```bash
pnpm mcp:dev
```

### Available MCP tools

- `auth_whoami`
- `topics_find_trending`
- `topics_list_recent_domains`
- `post_generate_from_topic`
- `posts_list`
- `posts_get`
- `posts_create`
- `posts_update`
- `posts_delete`

### Security model

- Clients authenticate through the xmcp Clerk middleware flow.
- Tools resolve the authenticated Clerk session user (`session.userId`).
- MCP server calls Convex MCP bridge with `MCP_SERVICE_SECRET` and user id.
- Bridge functions enforce user scoping on all data operations.

### Current limitations

- Generation is synchronous/blocking (job queue planned later).
- `provider=gsc` is not enabled yet and currently returns a not-configured error.
- GSC will be `app` scope first; user scope comes in a later phase.
