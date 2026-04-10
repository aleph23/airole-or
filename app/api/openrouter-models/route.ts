import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const apiKey = searchParams.get('apiKey') || process.env.OPENROUTER_API_KEY
    const apiBaseUrl = searchParams.get('apiBaseUrl') || 'https://openrouter.ai/api/v1'
    const filter = searchParams.get('filter') // e.g. 'vision'

    const res = await fetch(`${apiBaseUrl}/models`, {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!res.ok) {
      return NextResponse.json({ error: `OpenRouter API error: ${res.statusText}` }, { status: res.status })
    }

    const data = await res.json()

    // Filter models based on modality if requested
    // If filter is 'vision', filter for both "image" and "text" input
    // Do NOT sort (OpenRouter presents newest first)
    let models = data.data || []
    if (filter === 'vision') {
      models = models.filter((m: any) => {
        const modalities: string[] = m.architecture?.input_modalities ?? []
        return modalities.includes('image') && modalities.includes('text')
      })
    } else {
      // For chat models, ensure they support text output
      models = models.filter((m: any) => {
        const outModalities: string[] = m.architecture?.output_modalities ?? []
        return outModalities.includes('text')
      })
    }

    const mappedModels = models.map((m: any) => ({ 
      value: m.id, 
      label: m.name || m.id 
    }))

    return NextResponse.json({ models: mappedModels })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
