type TextContent = {
  type: 'text';
  text: string;
};

type ToolResult = {
  content: TextContent[];
  structuredContent: unknown;
};

export const toToolResult = (
  structuredContent: unknown,
  text: string,
): ToolResult => {
  return {
    content: [
      {
        type: 'text',
        text,
      },
    ],
    structuredContent,
  };
};
