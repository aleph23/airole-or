import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { UI_TEXTS } from '@/lib/i18n'

export async function POST(request: NextRequest) {
  const { accessToken, interfaceLanguage = 'en' } = await request.json()
  const t = UI_TEXTS[interfaceLanguage as 'zh' | 'en'] || UI_TEXTS.en

  try {
    // Check if Google OAuth is configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json({ error: 'Google Drive integration not configured' }, { status: 503 })
    }

    if (!accessToken) {
      return NextResponse.json({ error: t.googleDriveMessages.unauthorized }, { status: 401 })
    }

    // create google Drive client
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: accessToken })

    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    // Find the ai role folder
    const folderSearchResponse = await drive.files.list({
      q: "name='AIRole_Characters' and mimeType='application/vnd.google-apps.folder'",
      fields: 'files(id, name)',
    })

    if (!folderSearchResponse.data.files || folderSearchResponse.data.files.length === 0) {
      return NextResponse.json({ files: [] })
    }

    const folderId = folderSearchResponse.data.files[0].id

    // Get all json files in a folder
    const filesResponse = await drive.files.list({
      q: `parents='${folderId}' and mimeType='application/json'`,
      fields: 'files(id, name, modifiedTime, size)',
      orderBy: 'modifiedTime desc',
    })

    const files =
      filesResponse.data.files?.map((file) => ({
        id: file.id,
        name: file.name,
        modifiedTime: file.modifiedTime,
        size: file.size,
      })) || []

    return NextResponse.json({ files })
  } catch (error) {
    console.error('Failed to get Google Drive file list:', error)
    return NextResponse.json(
      {
        error: t.googleDriveMessages.loadError,
        details: error instanceof Error ? error.message : t.googleDriveMessages.unknownError,
      },
      { status: 500 }
    )
  }
}
