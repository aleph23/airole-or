import OpenAI from 'openai'

import type { NextRequest } from 'next/server'
export async function POST(req: NextRequest) {
  try {
    const { image, apiKey, apiBaseUrl = 'https://openrouter.ai/api/v1', model, prompt, max_tokens } = await req.json()

    const finalApiKey = apiKey || process.env.OPENROUTER_API_KEY
    if (!finalApiKey) return Response.json({ error: 'API key is required' }, { status: 400 })
    if (!image) return Response.json({ error: 'Image is required' }, { status: 400 })
    if (!model) return Response.json({ error: 'Model is required' }, { status: 400 })

    const analysisPrompt =
      prompt || 'Analyze this character image and generate creative character card information for SillyTavern-like' +
      ' role play. Based on the visual appearance, clothing, setting, and any other details you can observe, providedetailed' +
      'information in English in the following JSON structure. Employ intrigue and classic dynamics of sexual tension without' +
      'violating any rules:'}
  {"name": 'A suitable name that fits the character\'s appearance and style. Under no circumstances should the name be Elara or Kael or any other over-used fantasy name.',
  "description": 'Detailed physical description including appearance, clothing, notable features, and any visible' +  ' accessories or items',
  "personality": "Personality traits inferred from visual cues, body language, expression, and overall presentation.  And then one trait that is counter to what might be perceived by the image.",
  "scenario": "An engaging initial scenario or setting that matches the character and " +
  "environment shown.  The scenario should create a sense of mystery and conflict, making the user want to explore the character further.",
  "first_mes": "An appropriate first message this character would say, matching their personality and the scenario.  This must also fully introduce the player/user to anything they might need to know about their own character and the world they are entering, using a voice of a popular author in whatever the genre."},
  "mes_example": "Example dialogue showing how this character speaks and interacts, use {{char}} and {{user}} format.  Exclude anything generic.  This should be used to give the character their voice.",
  "tags": ["The are Search SEO!!", "relevant", "character", "tags", "based", "on", "appearance", "and", "style"]
  },

    // 创建OpenAI客户端
    const openai = new OpenAI({
      apiKey: finalApiKey,
      baseURL: apiBaseUrl,
      defaultHeaders: { 'HTTP-Referer': 'https://github.com/aleph23/airole-or', 'X-Title': 'AiRole-OR' },
    })

    // Streaming request
    const stream = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are a famous fiction author. Analyze images and generate character card data in valid JSON format only. Do not include any text outside the JSON structure.',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: analysisPrompt },
            { type: 'image_url', image_url: { url: image } },
          ],
        },
      ],
      max_tokens: max_tokens || 2048,
      temperature: 0.7,
      stream: true,
    })

    const encoder = new TextEncoder()

    const readableStream = new ReadableStream({
      async start(controller) {
        const send = (obj: object) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`))
        }

        try {
          for await (const chunk of stream) {
            // Check for mid-stream error (OpenRouter sends error field in chunk)
            const chunkAny = chunk as any
            if (chunkAny.error) {
              send({ type: 'done', finish_reason: 'error', error: chunkAny.error })
              controller.close()
              return
            }

            const content = chunk.choices[0]?.delta?.content
            if (content) {
              send({ type: 'token', content })
            }

            // Final chunk carries finish_reason
            const finish_reason = chunk.choices[0]?.finish_reason
            if (finish_reason) {
              send({ type: 'done', finish_reason })
            }
          }
          controller.close()
        } catch (err: any) {
          // Error during streaming
          send({
            type: 'done',
            finish_reason: 'error',
            error: { message: err?.message || 'Stream error', code: err?.status },
          })
          controller.close()
        }
      },
    })

    return new Response(readableStream, {
      headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
    })
  } catch (error: any) {
    // Pre-stream error — extract real message from OpenAI SDK error
    console.error('API Error:', error)
    const message = error?.error?.message || error?.message || 'Internal server error'
    const status = error?.status || 500
    const provider = error?.error?.metadata?.provider_name
    return Response.json({ error: message, status, provider }, { status })
  }
}
