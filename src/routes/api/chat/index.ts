import { createFileRoute } from '@tanstack/solid-router'
import { RIVER_SERVER } from '~/lib/river'
import z from 'zod'
import { ModelMessage, streamText } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { env } from '~/lib/env'

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
})

export const chatDemoAiStream = (messages: ModelMessage[]) => {
  return streamText({
    system:
      "You are an assistant designed to help answer the user's questions. Always respond in normal text format.",
    model: openrouter('meta-llama/llama-4-maverick:free'),
    messages,
  })
}

const riverRouter = RIVER_SERVER.createAgentRouter({
  chat: RIVER_SERVER.createAiSdkAgent({
    inputSchema: z.array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string(),
      }),
    ),
    agent: (messages) => {
      return chatDemoAiStream(messages)
    },
  }),
})

export type RiverRouter = typeof riverRouter

const { POST } = RIVER_SERVER.createServerEndpointHandler(riverRouter)

export const Route = createFileRoute('/api/chat/')({
  server: {
    handlers: {
      POST: ({ request }) => POST(request),
    },
  },
})
