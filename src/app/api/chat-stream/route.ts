import type { NextRequest } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { messages, apiKey, apiBaseUrl = 'https://openrouter.ai/api/v1', model } = await req.json()

    const finalApiKey = apiKey || process.env.OPENROUTER_API_KEY
    if (!finalApiKey) {
      return new Response(JSON.stringify({ error: 'API key is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!model) {
      return new Response(JSON.stringify({ error: 'Model is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Create OpenAI client
    const openai = new OpenAI({
      apiKey: finalApiKey,
      baseURL: apiBaseUrl,
      defaultHeaders: { 'HTTP-Referer': 'https://github.com/aleph23/airole-or', 'X-Title': 'AiRole-OR' },
      dangerouslyAllowBrowser: true,
    })

    // Create streaming responses
    const stream = await openai.chat.completions.create({ model: model, messages: messages, stream: true })

    // Set response headers
    const headers = new Headers()
    headers.set('Content-Type', 'text/plain')
    headers.set('Cache-Control', 'no-cache')
    headers.set('Connection', 'keep-alive')

    // Create streaming responses
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              controller.enqueue(encoder.encode(content))
            }
          }
          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, { headers })
  } catch (error) {
    console.error('API Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
