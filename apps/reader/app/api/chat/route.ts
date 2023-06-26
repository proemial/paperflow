import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Env } from 'data/adapters/env';
import { cookies } from 'next/headers';
import { UserSettings } from '@/app/(pages)/profile/page';

const config = new Configuration({
  apiKey: Env.connectors.openai.apiKey,
});
const openai = new OpenAIApi(config);

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, title, abstract } = await req.json();

  const moddedMessages = [
    {role: 'system', content: `Here is some context: title: ${title}, abstract: ${abstract}.`},
    ...messages,
  ];

  const {model, prompt} = chatConfig();

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

function chatConfig() {
  const model = getModel();
  return {
    model,
    prompt: model === 'gpt-4'
      ? 'In a single sentence, enclosing relevant concepts with double parenthesis,'
      : 'In a single sentence, ',
  }
}

function getModel() {
  const cookieStore = cookies();
  const settingsString = cookieStore.get("settings")?.value || "{}";

  const settings = JSON.parse(settingsString) as UserSettings;

  return settings['gpt4']
    ? 'gpt-4'
    : 'gpt-3.5-turbo';
}
