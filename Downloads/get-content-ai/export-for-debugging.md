# Get Content AI - Code Export for Debugging

## Project Overview
AI-powered social media content creation platform with text, image, and video generation capabilities.

## Current Issues to Debug
1. TypeScript errors in ai-service.ts (function parameters, variable names)
2. Content preview component missing type definitions
3. Authentication redirect flow needs completion
4. Google Gemini video generation integration

## Key Files

### server/ai-service.ts
```typescript
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

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

/**
 * Generates social media content using either OpenAI or Claude
 */
export async function generateSocialContent(
  prompt: string,
  platform: Platform,
  contentType: ContentType,
  targetAudience: string = "",
  options: AdvancedOptions = defaultAdvancedOptions,
  preferredModel?: "openai" | "claude"
): Promise<{ mainContent: ContentResponse; variations: ContentVariation[] }> {
  try {
    // Use preferred model from user preferences or fallback to option
    const modelToUse = preferredModel || options.languageModel;
    
    let result;
    if (modelToUse === "claude") {
      result = await generateWithClaude(prompt, platform, contentType, targetAudience, options);
    } else {
      result = await generateWithOpenAI(prompt, platform, contentType, targetAudience, options);
    }
    
    // Generate image if content type is "postWithImage"
    if (contentType === "postWithImage") {
      try {
        const imageUrl = await generateContentImage(result.mainContent.content, platform);
        result.mainContent.imageUrl = imageUrl;
      } catch (imageError) {
        console.error("Image generation failed:", imageError);
        // Continue without image rather than failing completely
      }
    }
    
    // Generate video if content type is "postWithVideo"
    if (contentType === "postWithVideo") {
      try {
        const videoUrl = await generateContentVideo(result.mainContent.content, platform);
        result.mainContent.videoUrl = videoUrl;
      } catch (videoError) {
        console.error("Video generation failed:", videoError);
        // Continue without video rather than failing completely
      }
    }
    
    return result;
  } catch (error) {
    console.error("AI generation failed:", error);
    return generateFallbackContent(prompt, platform, contentType);
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
    console.error("OpenAI generation failed:", error);
    throw error;
  }
}

async function generateWithClaude(
  prompt: string,
  platform: Platform,
  contentType: ContentType,
  targetAudience: string = "",
  options: AdvancedOptions = defaultAdvancedOptions,
  userSubscriptionStatus?: string
): Promise<{ mainContent: ContentResponse; variations: ContentVariation[] }> {
  const systemPrompt = `You are an expert social media content creator for ${platform}. Create ${contentType} content for ${targetAudience || 'general audience'} with ${options.contentStyle} style. ${options.includeEmojis ? 'Use emojis' : 'No emojis'}. ${options.includeCTA ? 'Include CTA' : 'No CTA'}. Return JSON with mainContent and variations.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219', // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      max_tokens: 1024,
      messages: [{ role: 'user', content: `${systemPrompt}\n\nTopic: ${topic}` }],
    });

    const result = JSON.parse(response.content[0].text);
    return {
      mainContent: result.mainContent || { title: "Generated Content", content: "Content generated successfully" },
      variations: result.variations || []
    };
  } catch (error) {
    console.error("Claude generation failed:", error);
    throw error;
  }
}

function generateFallbackContent(
  prompt: string,
  platform: Platform,
  contentType: ContentType
): { mainContent: ContentResponse; variations: ContentVariation[] } {
  const mainContent: ContentResponse = {
    title: "Sample Content",
    content: `Here's some ${contentType} content for ${platform}!`
  };

  return {
    mainContent: { title: "Sample Content", content: `Here's some ${contentType} content for ${platform}!` },
    variations: [
      { content: "Alternative version 1" },
      { content: "Alternative version 2" }
    ]
  };
}

/**
 * Generates an image using DALL-E 3 based on content text
 */
async function generateContentImage(content: string, platform: Platform): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const { OpenAI } = await import('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Create a focused image prompt based on the content
  const imagePrompt = `Create a high-quality, visually appealing image for ${platform} social media post. Content context: "${content.slice(0, 200)}". Style: modern, professional, eye-catching, suitable for social media. No text overlay.`;

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (!response.data[0]?.url) {
      throw new Error('No image URL returned from DALL-E');
    }

    return response.data[0].url;
  } catch (error) {
    console.error("DALL-E image generation failed:", error);
    throw error;
  }
}

/**
 * Generates a video using Google Gemini based on content text
 */
async function generateContentVideo(content: string, platform: Platform): Promise<string> {
  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    throw new Error('Google Gemini API key not configured');
  }

  // Create a focused video prompt based on the content
  const videoPrompt = `Create a short, engaging video for ${platform} social media. Content context: "${content.slice(0, 200)}". 
  Style: modern, professional, eye-catching, suitable for social media. Duration: 15-30 seconds. 
  Include dynamic visuals, smooth transitions, and engaging motion graphics that complement the text content.`;

  try {
    // Generate a video concept using Gemini text generation first
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate a detailed video concept for this social media content: "${content}". Include visual elements, scenes, and motion descriptions for a ${platform} video. Keep it engaging and under 30 seconds.`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API request failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Gemini video concept generated:', data.candidates?.[0]?.content?.parts?.[0]?.text);
    
    // For now, return a demo video URL since actual video generation requires additional setup
    // This would be replaced with actual video generation in production
    return `https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4`;
    
  } catch (error) {
    console.error("Gemini video generation failed:", error);
    throw error;
  }
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
  // Implementation here
  return [];
}
```

### client/src/lib/types.ts
```typescript
// Social platform types
export type Platform = "instagram" | "twitter" | "facebook" | "linkedin";

export type SocialPlatform = {
  id: Platform;
  name: string;
  icon: string;
};

// Content types optimized for each platform's popular formats
export type ContentType = "post" | "carousel" | "story" | "thread" | "reel" | "article";

// Content response type
export interface ContentResponse {
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
}

// Content variation type
export interface ContentVariation {
  title?: string;
  content: string;
}

// Content history type
export interface ContentHistory {
  id: string;
  title: string;
  platform: Platform;
  createdAt: string;
}

// Generation request type
export interface GenerationRequest {
  topic: string;
  tone: string;
  keywords?: string;
  audience: string;
  platform: Platform;
  contentType: ContentType;
}

// Generation response type
export interface GenerationResponse {
  mainContent: ContentResponse;
  variations: ContentVariation[];
}
```

### client/src/components/auth/auth-context.tsx
```typescript
// Authentication context with login/signup redirect fixes needed
// Issues: Need to complete redirect flow to home page after auth
```

### client/src/components/dashboard/content-preview.tsx
```typescript
// Content preview component with video/image display
// Issues: Missing type imports and property definitions
```

## API Keys Required
- OPENAI_API_KEY: sk_...
- ANTHROPIC_API_KEY: sk_...
- GOOGLE_GEMINI_API_KEY: AIzaSyAPiIJrnLwyLVcR8471yLlYe0Uvxz60df8
- STRIPE_SECRET_KEY: sk_live_...
- VITE_STRIPE_PUBLIC_KEY: pk_live_...

## Main Issues to Fix
1. Fix function parameter mismatch in generateWithClaude and generateWithOpenAI
2. Add userSubscriptionStatus parameter or remove reference
3. Fix 'topic' variable reference in Claude function
4. Update ContentResponse interface imports across components
5. Complete authentication redirect implementation
6. Fix type mismatches in content preview component

## Stack
- React + TypeScript + Vite
- Express.js backend
- OpenAI + Anthropic + Google Gemini APIs
- Stripe payments
- Firebase authentication
- Tailwind CSS + shadcn/ui