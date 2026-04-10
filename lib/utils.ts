import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { TavernCardV2 } from './types'
import { Png } from './Png'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 提取JSON内容的函数
export const extractJsonFromContent = (content: string): string => {
  // 移除前后空白
  content = content.trim()

  // 1. Try to match all ```json ... ``` blocks, taking the last one
  const jsonBlocks = [...content.matchAll(/```json\s*([\s\S]*?)\s*```/g)]
  if (jsonBlocks.length > 0) {
    return jsonBlocks[jsonBlocks.length - 1][1].trim()
  }

  // 2. Try to match all ``` ... ``` blocks, taking the content inside the last square bracket
  const codeBlocks = [...content.matchAll(/```\s*([\s\S]*?)\s*```/g)]
  if (codeBlocks.length > 0) {
    for (let i = codeBlocks.length - 1; i >= 0; i--) {
      const innerContent = codeBlocks[i][1].trim()
      if (innerContent.startsWith('{') && innerContent.endsWith('}')) {
        return innerContent
      }
    }
  }

  // 3.Try to match the last { ... } structure
  // Note: This regular expression is relatively broad and may match
  // incomplete or nested JSON, but it is useful in simple scenarios.
  const directJsonMatch = content.match(/\{[\s\S]*\}/g)
  if (directJsonMatch && directJsonMatch.length > 0) {
    return directJsonMatch[directJsonMatch.length - 1]
  }

  return content
}

// JSON 导出函数
export const exportAsJson = (characterData: TavernCardV2) => {
  const dataStr = JSON.stringify(characterData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${characterData.data.name || 'character'}.json`
  link.click()
  URL.revokeObjectURL(url)
}

// PNG 导出函数
export const exportAsPng = async (characterData: TavernCardV2, characterImage: string) => {
  try {
    if (!characterImage || characterImage.includes('placeholder.svg')) {
      alert('请先上传一张图片')
      return
    }

    // 创建一个Image对象来加载原始图片
    const img = new Image()
    img.crossOrigin = 'anonymous' // 处理跨域问题

    const imageLoadPromise = new Promise<HTMLCanvasElement>((resolve, reject) => {
      img.onload = () => {
        // Create a Canvas to convert images to PNG format
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('无法创建Canvas上下文'))
          return
        }

        // Set the Canvas size to be the same as the original image
        canvas.width = img.width
        canvas.height = img.height

        // Draw pictures on Canvas
        ctx.drawImage(img, 0, 0)

        resolve(canvas)
      }

      img.onerror = () => {
        reject(new Error('图片加载失败'))
      }
    })

    img.src = characterImage
    const canvas = await imageLoadPromise

    // Convert Canvas to Blob in PNG format
    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Canvas转换为PNG失败'))
        }
      }, 'image/png')
    })

    // 将PNG Convert Blob to ArrayBuffer
    const pngArrayBuffer = await pngBlob.arrayBuffer()

    // Convert role data to JSON string
    const cardData = JSON.stringify(characterData)

    // 使用Png.Generate generates PNG with character card data
    const pngWithData = Png.Generate(pngArrayBuffer, cardData, { version: 'v2' })

    // Create download link
    const dataBlob = new Blob([pngWithData], { type: 'image/png' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${characterData.data.name || 'character'}.png`
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('PNG export failed:', error)
    alert('PNG导出失败: ' + (error as Error).message)
  }
}

// Functions that generate language-related prompt words
export const getLanguagePrompts = (language: string, customLanguage: string) => {
  const currentLang = language === 'custom' ? customLanguage : language

  const prompts = {
    'zh-CN': {
      imageAnalysis: `请分析这张角色图片，并为SillyTavern生成全面的角色卡信息。基于视觉外观、服装、设定和其他可观察到的细节，请用中文提供详细信息。格式如下JSON结构：

{
  "name": "符合角色外观和风格的合适名字",
  "description": "详细的外貌描述，包括外观、服装、显著特征和任何可见的配饰或物品",
  "personality": "从视觉线索、肢体语言、表情和整体呈现推断出的性格特征",
  "scenario": "与角色和所显示环境相匹配的引人入胜的初始场景或设定，增强悬疑和冲突，让用户有探索的欲望",
  "first_mes": "这个角色会说的合适的第一句话，符合他们的性格和场景",
  "mes_example": "展示这个角色如何说话和互动的示例对话，使用{{char}}和{{user}}格式",
  "tags": ["基于外观和风格的相关角色标签"],
  "character_book": {
    "name": "角色知识库",
    "description": "关于角色的背景知识和世界观设定",
    "scan_depth": 100,
    "token_budget": 500,
    "recursive_scanning": true,
    "extensions": {},
    "entries": [
      {
        "keys": ["关键词1", "关键词2"],
        "content": "当提到相关关键词时要插入的背景信息内容",
        "extensions": {},
        "enabled": true,
        "insertion_order": 0,
        "case_sensitive": false,
        "name": "条目名称",
        "priority": 100,
        "id": 1,
        "comment": "条目备注",
        "selective": false,
        "secondary_keys": [],
        "constant": false,
        "position": "after_char"
      }
    ]
  }
}

让角色引人入胜、一致且发展完善。生成3-5个相关的角色书条目，包含角色的背景、世界观、重要关系等信息。只返回JSON对象，不要额外文本。`,
      chatSystem: `你是一个AI助手，帮助创建和完善SillyTavern的角色卡。当前角色数据是：{characterData}

请帮助用户根据他们的要求修改和改进角色。当建议更改时，请以清晰的格式提供具体的字段更新。专注于让角色更有吸引力、一致性和完善的发展。

如果用户要求更新角色信息，请直接返回JSON格式的更新数据，不要省略重复的字段数据，确保返回完整的数据。格式如下：
{
  "name": "角色名字",
  "description": "角色描述", 
  "personality": "性格特征",
  "scenario": "场景设定",
  "first_mes": "第一句话",
  "mes_example": "对话示例",
  "tags": ["标签1", "标签2"],
  "character_book": {
    "name": "角色知识库",
    "description": "关于角色的背景知识",
    "scan_depth": 100,
    "token_budget": 500,
    "recursive_scanning": true,
    "extensions": {},
    "entries": [
      {
        "keys": ["关键词"],
        "content": "背景信息内容",
        "extensions": {},
        "enabled": true,
        "insertion_order": 0,
        "case_sensitive": false,
        "name": "条目名称",
        "priority": 100,
        "id": 1,
        "comment": "备注",
        "selective": false,
        "secondary_keys": [],
        "constant": false,
        "position": "after_char"
      }
    ]
  }
}`,
    },
    en: {
      imageAnalysis: `Analyze this character image and generate creative character card information for SillyTavern-like role play. Based on the visual appearance, clothing, setting, and any other details you can observe, provide detailed information in English in the following JSON structure. Employ intrigue and classic dynamics of sexual tension without violating any rules:

{
  "name": "A suitable name that fits the character's appearance and style. Under no circumstances should the name be Elara or Kael or any other over-used fantasy name.",
  "description": "Detailed physical description including appearance, clothing, notable features, and any visible accessories or items",
  "personality": "Personality traits inferred from visual cues, body language, expression, and overall presentation.  And then one trait that is counter to what might be perceived by the image.",
  "scenario": "An engaging initial scenario or setting that matches the character and environment shown.  The scenario should create a sense of mystery and conflict, making the user want to explore the character further.",
  "first_mes": "An appropriate first message this character would say, matching their personality and the scenario.  This must also fully introduce the player/user to anything they might need to know about their own character and the world they are entering, using a voice of a popular author in whatever the genre.",
  "mes_example": "Example dialogue showing how this character speaks and interacts, use {{char}} and {{user}} format.  Exclude anything generic.  This should be used to give the character their voice.",
  "tags": ["The are Search SEO!!", "relevant", "character", "tags", "based", "on", "appearance", "and", "style"],
  "character_book": {
    "name": "Character Lore",
    "description": "Background knowledge and worldbuilding about the character",
    "scan_depth": 100,
    "token_budget": 1024,
    "recursive_scanning": true,
    "extensions": {},
    "entries": [
      {
        "keys": ["Must be words likely to be said", "keyword1", "keyword2"],
        "content": "Background information content to insert when related keywords are mentioned",
        "extensions": {},
        "enabled": true,
        "insertion_order": 0,
        "case_sensitive": false,
        "name": "Entry name",
        "priority": 100,
        "id": 1,
        "comment": "Entry comment",
        "selective": false,
        "secondary_keys": [],
        "constant": false,
        "position": "after_char"
      }
    ]
  }
}

Make the character engaging, quirky, and well-developed. Generate 2-4 relevant character book entries containing character background, worldview, important relationships, etc. Return ONLY the JSON object, no additional text.`,
      chatSystem: `You are an AI assistant helping to create and refine character cards for SillyTavern-like role play. The current character data is: {characterData}

Please help the user modify and improve the character based on their requests. When suggesting changes, provide specific field updates in a clear format. Focus on making the character more engaging, consistent, and well-developed. 

If the user requests to update character information,Do not omit any field data, ensure that the returned data is complete. Return the updated data directly in JSON format like this:
{
  "name": "Character name",
  "description": "Character description",
  "personality": "Personality traits", 
  "scenario": "Scenario setting",
  "first_mes": "First message",
  "mes_example": "Example dialogue",
  "tags": ["tag1", "tag2", "These are Search SEO Keywords!"],
  "character_book": {
    "name": "Character Lore",
    "description": "Background knowledge about the character",
    "scan_depth": 100,
    "token_budget": 500,
    "recursive_scanning": true,
    "extensions": {},
    "entries": [
      {
        "keys": ["keyword"],
        "content": "Background information content",
        "extensions": {},
        "enabled": true,
        "insertion_order": 0,
        "case_sensitive": false,
        "name": "Entry name",
        "priority": 100,
        "id": 1,
        "comment": "Comment",
        "selective": false,
        "secondary_keys": [],
        "constant": false,
        "position": "after_char"
      }
    ]
  }
}`,
    },
  }

  return prompts[currentLang as keyof typeof prompts] || prompts['zh-CN'] || prompts.en
}
