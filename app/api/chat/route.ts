import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages, apiKey, apiBaseUrl = 'https://openrouter.ai/api/v1', model } = await req.json()

    const finalApiKey = apiKey || process.env.OPENROUTER_API_KEY
    // Remove trailing slash if present
    const normalizedBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl

    if (!finalApiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 })
    }

    const response = await fetch(`${normalizedBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${finalApiKey}`,
        'HTTP-Referer': 'https://github.com/aleph23/airole-or',
        'X-Title': 'AiRole-OR',
      },
      body: JSON.stringify({
        model: model || 'xiaomi/mimo-v2-omni',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error?.message || `API error: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || 'No response generated'

    return NextResponse.json({ content })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
