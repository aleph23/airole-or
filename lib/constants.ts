// Constants for default configurations
export const DEFAULT_CONFIGS = {
  API_BASE_URL: 'https://openrouter.ai/api/v1',
  IMAGE_MODEL: 'xiaomi/mimo-v2-omni',
  CHAT_MODEL: 'anthropic/claude-sonnet-4.6',
  EVENT_BOOK_MODEL: 'xiaomi/mimo-v2-pro',
}

// Function switch
export const FEATURE_FLAGS = {
  SHOW_EVENT_BOOK: false, // Control whether to display event book related UI
}

// Default configuration based on interface language
export const LANGUAGE_SPECIFIC_CONFIGS = {
  zh: {
    API_BASE_URL: 'https://openrouter.ai/api/v1',
    IMAGE_MODEL: 'xiaomi/mimo-v2-omni',
    CHAT_MODEL: 'anthropic/claude-sonnet-4.6',
    EVENT_BOOK_MODEL: 'xiaomi/mimo-v2-pro',
    FREE_API_KEY_URL: 'https://openrouter.ai/keys',
    API_KEY_PLACEHOLDER: 'sk-or-...',
    API_KEY_LABEL: 'OpenRouter API Key',
  },
  en: {
    API_BASE_URL: 'https://openrouter.ai/api/v1',
    IMAGE_MODEL: 'xiaomi/mimo-v2-omni',
    CHAT_MODEL: 'anthropic/claude-sonnet-4.6',
    EVENT_BOOK_MODEL: 'xiaomi/mimo-v2-pro',
    FREE_API_KEY_URL: 'https://openrouter.ai/keys',
    API_KEY_PLACEHOLDER: 'sk-or-...',
    API_KEY_LABEL: 'OpenRouter API Key',
  },
}

// Get the default configuration based on the interface language
export const getLanguageSpecificConfig = (interfaceLanguage: 'zh' | 'en') => {
  return LANGUAGE_SPECIFIC_CONFIGS[interfaceLanguage] || LANGUAGE_SPECIFIC_CONFIGS.en
}

// Preserve backward-compatible global model options (mix all options)
export const IMAGE_MODEL_OPTIONS = [
  { value: 'xiaomi/mimo-v2-omni', label: 'Xiaomi Mimo V2 Omni' },
  { value: 'google/gemini-3-flash-preview', label: 'Gemini 3 Flash Preview' },
  { value: 'qwen/qwen3.5-122b-a10b', label: 'Qwen 3.5 122B A10B' },
  { value: 'moonshotai/kimi-k2.5', label: 'Kimi K2.5' },
  { value: 'z-ai/glm-4.6v', label: 'GLM 4.6V' },
  { value: 'mistralai/mistral-large-2512', label: 'Mistral Large 2512' },
]

export const CHAT_MODEL_OPTIONS = [
  { value: 'google/gemini-3-flash-preview', label: 'Gemini 3 Flash Preview' },
  { value: 'xiaomi/mimo-v2-pro', label: 'Mimo V2 Pro' },
  { value: 'moonshotai/kimi-k2.5', label: 'Kimi K2.5' },
]

// Interface language-based model options
export const LANGUAGE_SPECIFIC_MODEL_OPTIONS = {
  zh: {
    IMAGE_MODEL_OPTIONS: [
      { value: 'xiaomi/mimo-v2-omni', label: 'Xiaomi Mimo V2 Omni' },
      { value: 'google/gemini-3-flash-preview', label: 'Gemini 3 Flash Preview' },
      { value: 'qwen/qwen3.5-122b-a10b', label: 'Qwen 3.5 122B A10B' },
      { value: 'moonshotai/kimi-k2.5', label: 'Kimi K2.5' },
      { value: 'mistralai/mistral-large-2512', label: 'Mistral Large 2512' },
    ],
    CHAT_MODEL_OPTIONS: [
      { value: 'google/gemini-3-flash-preview', label: 'Gemini 3 Flash Preview' },
      { value: 'xiaomi/mimo-v2-pro', label: 'Mimo V2 Pro' },
      { value: 'moonshotai/kimi-k2.5', label: 'Kimi K2.5' },
    ],
  },
  en: {
    IMAGE_MODEL_OPTIONS: [
      { value: 'xiaomi/mimo-v2-omni', label: 'Xiaomi Mimo V2 Omni' },
      { value: 'google/gemini-3-flash-preview', label: 'Gemini 3 Flash Preview' },
      { value: 'qwen/qwen3.5-122b-a10b', label: 'Qwen 3.5 122B A10B' },
      { value: 'moonshotai/kimi-k2.5', label: 'Kimi K2.5' },
      { value: 'mistralai/mistral-large-2512', label: 'Mistral Large 2512' },
    ],
    CHAT_MODEL_OPTIONS: [
      { value: 'google/gemini-3-flash-preview', label: 'Gemini 3 Flash Preview' },
      { value: 'xiaomi/mimo-v2-pro', label: 'Mimo V2 Pro' },
      { value: 'moonshotai/kimi-k2.5', label: 'Kimi K2.5' },
    ],
  },
}

// Get model options based on interface language
export const getLanguageSpecificModelOptions = (interfaceLanguage: 'zh' | 'en') => {
  return LANGUAGE_SPECIFIC_MODEL_OPTIONS[interfaceLanguage] || LANGUAGE_SPECIFIC_MODEL_OPTIONS.en
}

// Commonly used adjustments
export const ADJUSTMENT_PRESETS = {
  zh: [
    {
      name: '增加冲突',
      content: '请帮我增加更多戏剧性冲突和张力，让角色的背景故事更加引人入胜，包含更多情感纠葛和矛盾。',
    },
    { name: '强化吸引力', content: '请在不违规的前提下，最大化角色和场景的性张力' },
    {
      name: '轻小说风格',
      content: '请将角色改造成轻小说风格，增加更多萌属性、日系元素，让对话更加活泼有趣，符合ACG文化特色。',
    },
    {
      name: '增强个性',
      content: '请强化角色的独特个性特征，让角色更加鲜明立体，增加独特的口头禅、行为习惯和性格quirks。',
    },
    {
      name: '深化背景',
      content: '请为角色添加更丰富的背景故事，包括童年经历、重要转折点、人际关系网络等，让角色更有深度。',
    },
    { name: '优化对话', content: '请优化角色的对话风格和语言习惯，让说话方式更符合角色设定，增加语言的个性化特色。' },
  ],
  en: [
    {
      name: 'Add Conflict',
      content:
        "Please help me add more dramatic conflicts and tension to make the character's background story more engaging, including more emotional entanglements and contradictions.",
    },
    {
      name: 'More Attractive',
      content: 'Please make the character more attractive and making the character more appealing to the reader.',
    },
    {
      name: 'Light Novel Style',
      content:
        'Please transform the character into a light novel style, adding more moe attributes and Japanese elements, making the dialogue more lively and interesting, fitting ACG culture.',
    },
    {
      name: 'Enhance Personality',
      content:
        "Please strengthen the character's unique personality traits, make the character more distinctive and three-dimensional, add unique catchphrases, behavioral habits, and personality quirks.",
    },
    {
      name: 'Deepen Background',
      content:
        'Please add a richer background story for the character, including childhood experiences, important turning points, interpersonal networks, etc., to give the character more depth.',
    },
    {
      name: 'Optimize Dialogue',
      content:
        "Please optimize the character's dialogue style and language habits, make the speaking style more consistent with the character setting, and add personalized language features.",
    },
  ],
}

export const LANGUAGE_OPTIONS = [
  { value: 'zh-CN', label: '中文 (简体)' },
  { value: 'zh-TW', label: '中文 (繁體)' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ru', label: 'Русский' },
  { value: 'custom', label: 'Custom / 自定义' },
]

export const INTERFACE_LANGUAGE_OPTIONS = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
]
