import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { UI_TEXTS } from '@/lib/i18n'

export async function POST(request: NextRequest) {
  const { accessToken, fileId, interfaceLanguage = 'en' } = await request.json()
  const t = UI_TEXTS[interfaceLanguage as 'zh' | 'en'] || UI_TEXTS.en

  try {
    // Check if Google OAuth is configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json({ error: 'Google Drive integration not configured' }, { status: 503 })
    }

    if (!accessToken) {
      return NextResponse.json({ error: t.googleDriveMessages.unauthorized }, { status: 401 })
    }

    if (!fileId) {
      return NextResponse.json({ error: t.googleDriveMessages.fileNotFound }, { status: 400 })
    }

    // create google Drive client
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: accessToken })

    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    // Get file content
    const response = await drive.files.get({ fileId, alt: 'media' })

    if (!response.data) {
      return NextResponse.json({ error: t.googleDriveMessages.fileNotFound }, { status: 404 })
    }

    // Parse json data
    let loadedData
    try {
      loadedData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data
    } catch (parseError) {
      return NextResponse.json(
        { error: t.googleDriveMessages.invalidFileFormat, details: t.googleDriveMessages.invalidFileFormat },
        { status: 400 }
      )
    }

    // Check data format, support new and old formats
    let characterData, characterImage, chatMessages

    if (loadedData.characterData) {
      // New format: contains complete data package
      characterData = loadedData.characterData
      characterImage = loadedData.characterImage
      chatMessages = loadedData.chatMessages || []
    } else {
      // Old format: only character data
      characterData = loadedData
      characterImage = null
      chatMessages = []
    }

    return NextResponse.json({
      success: true,
      characterData,
      characterImage,
      chatMessages,
      message: t.googleDriveMessages.loadSuccess,
    })
  } catch (error) {
    console.error('Google Drive failed to load:', error)
    return NextResponse.json(
      {
        error: t.googleDriveMessages.loadError,
        details: error instanceof Error ? error.message : t.googleDriveMessages.unknownError,
      },
      { status: 500 }
    )
  }
}
