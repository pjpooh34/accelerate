import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Type definitions for AI service
export type Platform = "instagram" | "twitter" | "facebook" | "linkedin";
export type ContentType = "postWithImage" | "postWithVideo" | "carousel" | "story" | "textOnly";

export interface ContentResponse {
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface ContentVariation {
  title?: string;
  content: string;
}

export interface AdvancedOptions {
  creativity: number;
  maxLength: number;
  includeEmojis: boolean; 
  includeCTA: boolean;
  includeHashtags: boolean;
  customHashtags: string[];
  avoidWords: string[];
  contentStyle: string;
  languageModel: "openai" | "claude";
}

export const defaultAdvancedOptions: AdvancedOptions = {
  creativity: 0.7,
  maxLength: 280,
  includeEmojis: true,
  includeCTA: true,
  includeHashtags: true,
  customHashtags: [],
  avoidWords: [],
  contentStyle: "balanced",
  languageModel: "openai"
};

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generates social media content using either OpenAI or Claude
 */
export async function generateSocialContent(
  topic: string,
  tone: string,
  audience: string,
  platform: Platform,
  contentType: ContentType,
  keywords?: string,
  options: AdvancedOptions = defaultAdvancedOptions,
  userSubscriptionStatus: string = "free"
): Promise<{ mainContent: ContentResponse; variations: ContentVariation[] }> {
  
  if (options.languageModel === "claude") {
    return generateWithClaude(topic, tone, audience, platform, contentType, keywords, options, userSubscriptionStatus);
  } else {
    return generateWithOpenAI(topic, tone, audience, platform, contentType, keywords, options, userSubscriptionStatus);
  }
}

async function generateWithOpenAI(
  prompt: string,
  platform: Platform,
  contentType: ContentType,
  targetAudience: string = "",
  options: AdvancedOptions = defaultAdvancedOptions
): Promise<{ mainContent: ContentResponse; variations: ContentVariation[] }> {
  
  const platformLimits = {
    twitter: 280,
    instagram: 2200,
    facebook: 63206,
    linkedin: 3000
  };

  const maxLength = Math.min(options.maxLength, platformLimits[platform]);
  
  const systemPrompt = `You are an expert social media content creator specializing in ${platform}. 
Create engaging, authentic content that drives real engagement and follows platform best practices.

Platform: ${platform}
Content Type: ${contentType}
Target Audience: ${targetAudience || 'General audience'}
Style: ${options.contentStyle}
Character Limit: ${maxLength}

Requirements:
- ${options.includeEmojis ? 'Include 2-3 relevant emojis naturally' : 'No emojis'}
- ${options.includeCTA ? 'Include compelling call-to-action' : 'No call-to-action'}
- ${options.includeHashtags ? 'Include 3-5 strategic hashtags' : 'No hashtags'}
- Creativity level: ${options.creativity}/10
- Stay under ${maxLength} characters
${options.customHashtags.length ? `- Must include: ${options.customHashtags.join(', ')}` : ''}
${options.avoidWords.length ? `- Avoid: ${options.avoidWords.join(', ')}` : ''}

Generate content that feels authentic and valuable. Return JSON format:
{
  "mainContent": {"title": "Title", "content": "Main content"},
  "variations": [{"content": "Variation 1"}, {"content": "Variation 2"}, {"content": "Variation 3"}]
}`;

  // Choose model based on subscription status
  const model = userSubscriptionStatus === "active" ? "gpt-4-turbo" : "gpt-3.5-turbo"; // Pro users get GPT-4, free users get GPT-3.5
  
  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: options.creativity,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      mainContent: result.mainContent || { title: "Generated Content", content: "Content generated successfully" },
      variations: result.variations || []
    };
  } catch (error) {
    console.error('OpenAI generation error:', error);
    return generateFallbackContent(topic, platform, contentType);
  }
}

async function generateWithClaude(
  topic: string,
  tone: string,
  audience: string,
  platform: Platform,
  contentType: ContentType,
  keywords?: string,
  options: AdvancedOptions = defaultAdvancedOptions,
  userSubscriptionStatus: string = "free"
): Promise<{ mainContent: ContentResponse; variations: ContentVariation[] }> {
  
  const platformLimits = {
    twitter: 280,
    instagram: 2200,
    facebook: 63206,
    linkedin: 3000
  };

  const maxLength = Math.min(options.maxLength, platformLimits[platform]);
  
  const prompt = `Create ${contentType} content for ${platform} about "${topic}".
    
Target audience: ${audience}
Tone: ${tone}
${keywords ? `Keywords to include: ${keywords}` : ''}
${options.customHashtags.length ? `Use these hashtags: ${options.customHashtags.join(', ')}` : ''}
${options.avoidWords.length ? `Avoid these words: ${options.avoidWords.join(', ')}` : ''}

Requirements:
- Maximum ${maxLength} characters
- Style: ${options.contentStyle}
- ${options.includeEmojis ? 'Include relevant emojis' : 'No emojis'}
- ${options.includeCTA ? 'Include call-to-action' : 'No call-to-action'}
- ${options.includeHashtags ? 'Include relevant hashtags' : 'No hashtags'}

Generate 1 main post and 3 variations. Respond only with valid JSON in this exact format:
{
  "mainContent": {"title": "Main Post Title", "content": "Main post content"},
  "variations": [
    {"content": "Variation 1"},
    {"content": "Variation 2"}, 
    {"content": "Variation 3"}
  ]
}`;

  // Choose model based on subscription status
  const model = userSubscriptionStatus === "active" ? "claude-4-0" : "claude-3-7-sonnet-20250219"; // Pro users get Claude 4.0, free users get 3.7
  
  try {
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
      temperature: options.creativity
    });

    const textContent = response.content.find(block => block.type === 'text');
    const result = JSON.parse(textContent?.text || '{}');
    return {
      mainContent: result.mainContent || { title: "Generated Content", content: "Content generated successfully" },
      variations: result.variations || []
    };
  } catch (error) {
    console.error('Claude generation error:', error);
    return generateFallbackContent(topic, platform, contentType);
  }
}

function generateFallbackContent(
  topic: string,
  platform: Platform,
  contentType: ContentType
): { mainContent: ContentResponse; variations: ContentVariation[] } {
  const mainContent: ContentResponse = {
    title: `${contentType} for ${platform}`,
    content: `Check out this amazing content about ${topic}! 🚀 #ContentCreation #SocialMedia`
  };

  const variations: ContentVariation[] = [
    { content: `Discover the power of ${topic}! Perfect for your ${platform} strategy. ✨` },
    { content: `${topic} is trending! Don't miss out on this incredible opportunity. 🔥` },
    { content: `Transform your ${platform} presence with ${topic}. Start today! 💪` }
  ];

  return { mainContent, variations };
}

/**
 * Generates more variations using the selected AI model
 */
export async function generateMoreVariations(
  platform: Platform,
  contentType: ContentType,
  baseContent: ContentResponse,
  options: AdvancedOptions = defaultAdvancedOptions
): Promise<ContentVariation[]> {
  
  const prompt = `Based on this ${platform} ${contentType}: "${baseContent.content}"
  
Generate 3 more creative variations with similar style and message.
Keep the same tone and key elements but make each unique.
Maximum ${options.maxLength} characters each.

Respond with JSON array: [{"content": "variation 1"}, {"content": "variation 2"}, {"content": "variation 3"}]`;

  try {
    if (options.languageModel === "claude") {
      const response = await anthropic.messages.create({
        model: "claude-4-0", // Latest Claude 4.0 model
        max_tokens: 512,
        messages: [{ role: "user", content: prompt }],
        temperature: options.creativity
      });

      const textContent = response.content.find(block => block.type === 'text');
      return JSON.parse(textContent?.text || '[]');
    } else {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: options.creativity,
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '[]');
      return Array.isArray(result) ? result : result.variations || [];
    }
  } catch (error) {
    console.error('AI variation generation error:', error);
    return [
      { content: `Another great take on ${baseContent.title}! 🌟` },
      { content: `${baseContent.title} - reimagined for maximum impact! 💫` },
      { content: `Fresh perspective on ${baseContent.title}. Love it! ❤️` }
    ];
  }
}