import { type XmcpConfig } from 'xmcp';

const config: XmcpConfig = {
  http: true,
  paths: {
    tools: './src/tools',
    prompts: false,
    resources: false,
  },
  template: {
    name: 'one-blog',
    description: 'One Blog MCP server',
  },
};

export default config;
