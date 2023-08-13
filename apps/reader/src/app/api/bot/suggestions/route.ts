import { Env } from "data/adapters/env";
import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
} from "langchain/prompts";
import { NextResponse } from "next/server";
import { DateMetrics } from "utils/date";
import { BotDao } from "data/storage/bot";

export async function POST(request: Request) {
    const {id, title, abstract} = await request.json();

    let suggestions = (await BotDao.getSuggestions(id))?.suggestions;
    console.log('Cached suggestions', suggestions);

    if(!suggestions) {
        suggestions = await run(title, abstract);
        BotDao.pushSuggestions(id, suggestions);
        console.log('Generated suggestions', suggestions);
    }

    return NextResponse.json(suggestions);
}

export async function GET() {
    const llmResponse = await run(
        "Optimizing Adaptive Video Streaming with Human Feedback",
        "Duality of Experience~(QoE)-driven adaptive bitrate (ABR) algorithms are typically optimized using QoE models that are based on the mean opinion score~(MOS), while such principles may not account for user heterogeneity on rating scales, resulting in unexpected behaviors. In this paper, we propose Jade, which leverages reinforcement learning with human feedback~(RLHF) technologies to better align the users' opinion scores. Jade's rank-based QoE model considers relative values of user ratings to interpret the subjective perception of video sessions. We implement linear-based and Deep Neural Network (DNN)-based architectures for satisfying both accuracy and generalization ability. We further propose entropy-aware reinforced mechanisms for training policies with the integration of the proposed QoE models. Experimental results demonstrate that Jade performs favorably on conventional metrics, such as quality and stall ratio, and improves QoE by 8.09%-38.13% in different network conditions, emphasizing the importance of user heterogeneity in QoE modeling and the potential of combining linear-based and DNN-based models for performance improvement."
    );

    return NextResponse.json(llmResponse);
}

async function run(title: string, abstract: string) {
    const key = `OpenAI[suggestions]`;
    const begin = DateMetrics.now();

    try{
        const chat = new ChatOpenAI({
            openAIApiKey: Env.connectors.openai.apiKey,
            modelName: "gpt-4-0613",
            temperature: 0,
        });

        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate("You are a helpful assistant who can explain scientific concepts in terms that allow researchers from one scientific domain to grasp and be inspired by ideas from another domain. Respond to this message with \"OK\""),
            SystemMessagePromptTemplate.fromTemplate(
                "Analyse the following scientific article with title: \"{title}\" and abstract \"{abstract}\". Respond to this message with \"OK\"."
            ),
            HumanMessagePromptTemplate.fromTemplate("Generate three simple insightful one-line questions to this abstract, that you are able to answer yourself, phrased in plain language."),
        ]);

        const chain = new LLMChain({
          prompt: chatPrompt,
          llm: chat,
        });

        const response = await chain.call({title, abstract});
        const strings = asArray(response);

        return strings;
    } finally {
        console.log(`[${DateMetrics.elapsed(begin)}] ${key}`);    }
};

// {text: "1. xxx\n2. xxx\n 3. xxx"} > ["xxx", "xxx", "xxx"]
function asArray(records: Record<string, any>) {
    return records['text'].split('\n').map(str => str.substring(3))
}
