export const Env = {
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV !== "development",

  connectors: {
    mongo: {
      uri: process.env.MONGO_CONNECT_STRING,
    },
    redis: {
      // Upstash
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

      ingestionLog: {
        uri: process.env.REDIS_INGESTION_LOG_URL as string,
        token: process.env.REDIS_INGESTION_LOG_TOKEN as string,
      },
      papers: {
        uri: process.env.REDIS_PAPERS_URL as string,
        token: process.env.REDIS_PAPERS_TOKEN as string,
      },
      // Redis Enterprise
      pipeline: {
        uri: process.env.REDIS_PIPELINE_URL as string,
        password: process.env.REDIS_PIPELINE_PASSWORD as string,
        port: Number(process.env.REDIS_PIPELINE_PORT as string),
      },
      config: {
        uri: process.env.REDIS_CONFIG_URL as string,
        password: process.env.REDIS_CONFIG_PASSWORD as string,
        port: Number(process.env.REDIS_CONFIG_PORT as string),
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
