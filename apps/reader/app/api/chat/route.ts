import { Configuration, OpenAIApi } from 'openai-edge';
import { Message, OpenAIStream, StreamingTextResponse } from 'ai';
import { Env } from 'data/adapters/env';

const config = new Configuration({
  apiKey: Env.connectors.openai.apiKey,
});
const openai = new OpenAIApi(config);

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, title, abstract } = await req.json();

  const moddedMessages = [
    {role: 'system', content: `Here is some context: title: ${title}, abstract: ${abstract}`},
    ...messages,
  ];

  const lastMessage = moddedMessages.at(-1);
  if(lastMessage.role === 'user') {
    if(!lastMessage.content.startsWith('!!'))
      lastMessage.content = `In a single sentence, ${lastMessage.content}`;
    else
      lastMessage.content = lastMessage.content.substring(2); // Remove the `!!`
  }

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: moddedMessages,
  });
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
