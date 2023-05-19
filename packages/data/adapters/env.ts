export const Env = {
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV !== "development",

  connectors: {
    mongo: {
      uri: process.env.MONGO_CONNECT_STRING,
    },
    redis: {
      ingestion: {
        uri: process.env.REDIS_INGESTION_URL as string,
        token: process.env.REDIS_INGESTION_TOKEN as string,
      },
      prompts: {
        uri: process.env.REDIS_PROMPTS_URL as string,
        token: process.env.REDIS_PROMPTS_TOKEN as string,
      },
      modelOutput: {
        uri: process.env.REDIS_MODEL_OUTPUT_URL as string,
        token: process.env.REDIS_MODEL_OUTPUT_TOKEN as string,
      },
    },
    qstash: {
      url: process.env.QSTASH_URL,
      token: process.env.QSTASH_TOKEN as string,
      currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
      nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY2,
    },
  }
}