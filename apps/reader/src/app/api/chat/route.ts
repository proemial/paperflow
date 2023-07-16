import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Env } from 'data/adapters/env';
import { Model } from 'data/adapters/redis/redis-client';
import { Configuration, OpenAIApi } from 'openai-edge';

const config = new Configuration({
  apiKey: Env.connectors.openai.apiKey,
});
const openai = new OpenAIApi(config);

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, title, abstract, model } = await req.json();

  const moddedMessages = [
    {role: 'system', content: `Here is some context: title: ${title}, abstract: ${abstract}.`},
    ...messages,
  ];
  const prompt = await chatPrompt(model);

  const lastMessage = moddedMessages.at(-1);
  if(lastMessage.role === 'user') {
    if(!lastMessage.content.startsWith('!!'))
      lastMessage.content = `${prompt} ${lastMessage.content}`;
    else
      lastMessage.content = lastMessage.content.substring(2); // Remove the `!!`
  }

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model,
    stream: true,
    messages: moddedMessages,
  });
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}

async function chatPrompt(model: Model) {
  return model === 'gpt-4'
    ? 'In a single sentence, enclosing relevant concepts with double parenthesis,'
    : 'In a single sentence, ';
}
