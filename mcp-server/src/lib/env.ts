const readEnv = (...keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
};

const requireEnv = (...keys: string[]): string => {
  const value = readEnv(...keys);
  if (!value) {
    throw new Error(`Missing required environment variable: ${keys[0]}`);
  }
  return value;
};

export const env = {
  convexUrl: requireEnv('MCP_CONVEX_URL', 'VITE_CONVEX_URL'),
  serviceSecret: requireEnv('MCP_SERVICE_SECRET'),
};
