# One Blog MCP Server

Remote MCP server for One Blog, built with `xmcp`.

## Run

```bash
pnpm --dir mcp-server install
pnpm mcp:dev
```

## Env

Copy `mcp-server/.env.example` to `mcp-server/.env` and set:

- `MCP_CONVEX_URL`
- `MCP_SERVICE_SECRET`
- `CLERK_SECRET_KEY`
- `CLERK_DOMAIN`
- `BASE_URL`

## Tools

- `auth_whoami`
- `topics_find_trending`
- `topics_list_recent_domains`
- `post_generate_from_topic`
- `posts_list`
- `posts_get`
- `posts_create`
- `posts_update`
- `posts_delete`
