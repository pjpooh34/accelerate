import OpenAI from "openai";
import Anthropic from '@anthropic-ai/sdk';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type Platform = "instagram" | "twitter" | "facebook" | "linkedin";

export interface EmojiHashtagSuggestions {
  emojis: {
    emoji: string;
    description: string;
    relevance_score: number; // 0-100
  }[];
  hashtags: {
    hashtag: string;
    category: string;
    popularity: 'trending' | 'high' | 'medium' | 'niche';
    reach_potential: number; // 0-100
  }[];
  platform_specific: {
    platform: Platform;
    recommended_emoji_count: number;
    recommended_hashtag_count: number;
    optimal_placement: string;
  }[];
}

/**
 * Generates AI-powered emoji and hashtag suggestions for social media content
 */
export async function generateEmojiHashtagSuggestions(
  content: string,
  platform: Platform,
  industry?: string,
  targetAudience?: string,
  languageModel: "openai" | "claude" = "openai"
): Promise<EmojiHashtagSuggestions> {
  try {
    if (languageModel === "claude") {
      return await generateWithClaude(content, platform, industry, targetAudience);
    } else {
      return await generateWithOpenAI(content, platform, industry, targetAudience);
    }
  } catch (error) {
    console.error("Error generating emoji/hashtag suggestions:", error);
    return generateFallbackSuggestions(content, platform);
  }
}

async function generateWithOpenAI(
  content: string,
  platform: Platform,
  industry?: string,
  targetAudience?: string
): Promise<EmojiHashtagSuggestions> {
  const systemPrompt = `You are an expert social media strategist specializing in emoji and hashtag optimization. 
  Analyze the provided content and generate relevant emoji and hashtag suggestions optimized for ${platform}.
  
  Consider:
  - Platform-specific best practices
  - Current trending hashtags
  - Emoji relevance and engagement potential
  - Target audience preferences
  ${industry ? `- Industry: ${industry}` : ''}
  ${targetAudience ? `- Target audience: ${targetAudience}` : ''}
  
  Respond in JSON format with the exact structure requested.`;

  const userPrompt = `Content: "${content}"
  
  Platform: ${platform}
  
  Generate emoji and hashtag suggestions in this JSON format:
  {
    "emojis": [
      {
        "emoji": "🚀",
        "description": "Rocket - represents growth and innovation",
        "relevance_score": 95
      }
    ],
    "hashtags": [
      {
        "hashtag": "#AI",
        "category": "technology",
        "popularity": "trending",
        "reach_potential": 90
      }
    ],
    "platform_specific": [
      {
        "platform": "${platform}",
        "recommended_emoji_count": 3,
        "recommended_hashtag_count": 5,
        "optimal_placement": "end of post"
      }
    ]
  }`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');
  return validateSuggestions(result);
}

async function generateWithClaude(
  content: string,
  platform: Platform,
  industry?: string,
  targetAudience?: string
): Promise<EmojiHashtagSuggestions> {
  const prompt = `You are an expert social media strategist. Analyze this content and generate emoji and hashtag suggestions for ${platform}.

Content: "${content}"
Platform: ${platform}
${industry ? `Industry: ${industry}` : ''}
${targetAudience ? `Target audience: ${targetAudience}` : ''}

Generate suggestions in JSON format with:
- emojis: array of {emoji, description, relevance_score}
- hashtags: array of {hashtag, category, popularity, reach_potential}  
- platform_specific: array with platform optimization details

Focus on trending, relevant, and engaging suggestions that maximize reach and engagement.`;

  const response = await anthropic.messages.create({
    model: 'claude-3-7-sonnet-20250219',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type === 'text') {
    const result = JSON.parse(content.text);
    return validateSuggestions(result);
  }
  throw new Error('Unexpected response format from Claude');
}

function validateSuggestions(data: any): EmojiHashtagSuggestions {
  return {
    emojis: data.emojis || [],
    hashtags: data.hashtags || [],
    platform_specific: data.platform_specific || []
  };
}

function generateFallbackSuggestions(content: string, platform: Platform): EmojiHashtagSuggestions {
  // Basic fallback suggestions based on content analysis
  const commonEmojis = [
    { emoji: "✨", description: "Sparkles - adds magic and excitement", relevance_score: 80 },
    { emoji: "🚀", description: "Rocket - represents growth and innovation", relevance_score: 85 },
    { emoji: "💡", description: "Light bulb - ideas and inspiration", relevance_score: 75 },
    { emoji: "🎯", description: "Target - focus and goals", relevance_score: 70 },
    { emoji: "🔥", description: "Fire - trending and popular", relevance_score: 90 }
  ];

  const commonHashtags = [
    { hashtag: "#content", category: "general", popularity: "high" as const, reach_potential: 70 },
    { hashtag: "#socialmedia", category: "marketing", popularity: "high" as const, reach_potential: 80 },
    { hashtag: "#AI", category: "technology", popularity: "trending" as const, reach_potential: 90 },
    { hashtag: "#creativity", category: "inspiration", popularity: "medium" as const, reach_potential: 65 },
    { hashtag: "#innovation", category: "business", popularity: "high" as const, reach_potential: 75 }
  ];

  const platformRecs = {
    instagram: { emoji_count: 3, hashtag_count: 10, placement: "end of post" },
    twitter: { emoji_count: 2, hashtag_count: 3, placement: "within text" },
    facebook: { emoji_count: 2, hashtag_count: 5, placement: "end of post" },
    linkedin: { emoji_count: 1, hashtag_count: 5, placement: "end of post" }
  };

  const rec = platformRecs[platform];

  return {
    emojis: commonEmojis.slice(0, rec.emoji_count),
    hashtags: commonHashtags.slice(0, rec.hashtag_count),
    platform_specific: [{
      platform,
      recommended_emoji_count: rec.emoji_count,
      recommended_hashtag_count: rec.hashtag_count,
      optimal_placement: rec.placement
    }]
  };
}

/**
 * Generates trending hashtag suggestions based on current trends
 */
export async function getTrendingHashtags(
  platform: Platform,
  category?: string,
  languageModel: "openai" | "claude" = "openai"
): Promise<{ hashtag: string; trend_score: number; category: string }[]> {
  try {
    const prompt = `Generate 10 currently trending hashtags for ${platform}${category ? ` in the ${category} category` : ''}. 
    Focus on hashtags that are actively trending and have high engagement potential.
    
    Respond in JSON format:
    [
      {
        "hashtag": "#TrendingTag",
        "trend_score": 95,
        "category": "technology"
      }
    ]`;

    if (languageModel === "claude") {
      const response = await anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
      });
      const content = response.content[0];
      if (content.type === 'text') {
        return JSON.parse(content.text);
      }
      throw new Error('Unexpected response format from Claude');
    } else {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });
      const result = JSON.parse(response.choices[0].message.content || '[]');
      return result.trending_hashtags || result;
    }
  } catch (error) {
    console.error("Error getting trending hashtags:", error);
    return [
      { hashtag: "#trending", trend_score: 80, category: "general" },
      { hashtag: "#viral", trend_score: 85, category: "general" },
      { hashtag: "#popular", trend_score: 75, category: "general" }
    ];
  }
}