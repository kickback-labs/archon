import { streamText, UIMessage, convertToModelMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: "openai/gpt-4.1-mini",
    system:
      "You are Archon, an expert cloud architect AI assistant. You help users design, plan, and optimize cloud infrastructure and architecture. You provide clear, practical guidance on cloud platforms (AWS, GCP, Azure), infrastructure patterns, cost optimization, security, and best practices.",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
