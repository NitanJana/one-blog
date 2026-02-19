type TextContent = {
  type: 'text';
  text: string;
};

type StructuredContent = Record<string, unknown>;

type ToolResult<T extends StructuredContent> = {
  content: TextContent[];
  structuredContent: T;
};

type ToolResultOptions = {
  includeJsonFallback?: boolean;
};

export const toToolResult = <T extends StructuredContent>(
  structuredContent: T,
  text: string,
  options: ToolResultOptions = {},
): ToolResult<T> => {
  const includeJsonFallback = options.includeJsonFallback ?? true;
  const content: TextContent[] = [
    {
      type: 'text',
      text,
    },
  ];

  if (includeJsonFallback) {
    content.push({
      // Fallback for clients/proxies that ignore structuredContent.
      type: 'text',
      text: JSON.stringify(structuredContent),
    });
  }

  return {
    content,
    structuredContent,
  };
};
