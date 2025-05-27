import OpenAI from "openai";
import { ContentResponse, ContentVariation, Platform, ContentType } from "@/lib/types";

// Advanced customization options interface
export interface AdvancedOptions {
  creativity: number;
  maxLength: number;
  includeEmojis: boolean; 
  includeCTA: boolean;
  includeHashtags: boolean;
  customHashtags: string[];
  avoidWords: string[];
  contentStyle: string;
  languageModel: string;
}

// Default options when none are provided
export const defaultAdvancedOptions: AdvancedOptions = {
  creativity: 0.7,
  maxLength: 280,
  includeEmojis: true,
  includeCTA: true,
  includeHashtags: true,
  customHashtags: [],
  avoidWords: [],
  contentStyle: "balanced",
  languageModel: "gpt-4o",
};

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "demo_key" });

/**
 * Generates social media content based on the given parameters
 */
export async function generateSocialContent(
  topic: string,
  platform: Platform,
  contentType: ContentType,
  tone: string,
  audience: string,
  keywords: string,
  options: AdvancedOptions = defaultAdvancedOptions
): Promise<{ mainContent: ContentResponse; variations: ContentVariation[] }> {
  try {
    // Create advanced prompt with customization options
    const customHashtagsText = options.customHashtags.length > 0 
      ? `Custom hashtags to include: ${options.customHashtags.map(tag => `#${tag}`).join(', ')}`
      : '';
    
    const avoidWordsText = options.avoidWords.length > 0
      ? `Words or phrases to avoid: ${options.avoidWords.join(', ')}`
      : '';
    
    const styleGuidance = {
      "balanced": "Use a well-balanced approach that's professional but approachable",
      "formal": "Maintain a formal and professional tone throughout the content",
      "friendly": "Use a conversational, friendly tone as if talking to a friend",
      "persuasive": "Focus on persuasive language that drives action and conversions",
      "educational": "Present information in an educational manner with facts and insights",
      "storytelling": "Structure the content as a narrative with a beginning, middle, and end"
    };
    
    const lengthGuidance = `Keep the content under ${options.maxLength} characters to fit ${platform} requirements.`;
    
    const prompt = `
      Create social media content for ${platform} with the following details:
      - Topic: ${topic}
      - Content Type: ${contentType}
      - Tone: ${tone}
      - Target Audience: ${audience}
      - Keywords to include: ${keywords || "None specified"}
      
      ### Advanced Customization Requirements ###
      - Style: ${styleGuidance[options.contentStyle as keyof typeof styleGuidance] || styleGuidance.balanced}
      - ${lengthGuidance}
      - ${options.includeEmojis ? 'Include relevant emojis throughout the content' : 'Do not use any emojis in the content'}
      - ${options.includeCTA ? 'Include a compelling call-to-action' : 'Do not include any call-to-action'}
      - ${options.includeHashtags ? 'Include relevant hashtags' : 'Do not include any hashtags'}
      ${customHashtagsText ? `- ${customHashtagsText}` : ''}
      ${avoidWordsText ? `- ${avoidWordsText}` : ''}
      
      Please provide:
      1. A main content piece with a catchy title and engaging body text
      2. Two alternative variations of the content
      
      The content should be optimized for ${platform} and follow best practices for that platform.
      ${options.maxLength ? `Ensure all content is within ${options.maxLength} characters.` : ''}
      
      Return the result in JSON format with the following structure:
      {
        "mainContent": {
          "title": "The catchy title",
          "content": "The main content text with appropriate formatting"
        },
        "variations": [
          {
            "title": "Alternative title 1",
            "content": "Alternative content 1"
          },
          {
            "title": "Alternative title 2",
            "content": "Alternative content 2"
          }
        ]
      }
    `;

    // In a real implementation, we would use OpenAI API
    // For demo purposes, creating mock response
    if (process.env.OPENAI_API_KEY) {
      const response = await openai.chat.completions.create({
        model: options.languageModel || "gpt-4o", // use selected model or default to gpt-4o
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: options.creativity, // use creativity level for temperature
      });
      
      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result;
    }

    // Mock response when no API key is provided
    return generateMockContent(topic, platform, tone);
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content");
  }
}

/**
 * Generates more variations based on existing content
 */
export async function generateMoreVariations(
  platform: Platform,
  contentType: ContentType,
  baseContent: ContentResponse,
  options: AdvancedOptions = defaultAdvancedOptions
): Promise<{ variations: ContentVariation[] }> {
  try {
    // Create advanced prompt with customization options
    const customHashtagsText = options.customHashtags.length > 0 
      ? `Custom hashtags to include: ${options.customHashtags.map(tag => `#${tag}`).join(', ')}`
      : '';
    
    const avoidWordsText = options.avoidWords.length > 0
      ? `Words or phrases to avoid: ${options.avoidWords.join(', ')}`
      : '';
    
    const styleGuidance = {
      "balanced": "Use a well-balanced approach that's professional but approachable",
      "formal": "Maintain a formal and professional tone throughout the content",
      "friendly": "Use a conversational, friendly tone as if talking to a friend",
      "persuasive": "Focus on persuasive language that drives action and conversions",
      "educational": "Present information in an educational manner with facts and insights",
      "storytelling": "Structure the content as a narrative with a beginning, middle, and end"
    };
    
    const lengthGuidance = `Keep the content under ${options.maxLength} characters to fit ${platform} requirements.`;
    
    const prompt = `
      Create four unique variations of this ${platform} content:
      
      Original Title: ${baseContent.title}
      Original Content: ${baseContent.content}
      
      Keep the same overall topic and key message, but create distinctly different approaches for each variation.
      
      ### Advanced Customization Requirements ###
      - Style: ${styleGuidance[options.contentStyle as keyof typeof styleGuidance] || styleGuidance.balanced}
      - ${lengthGuidance}
      - ${options.includeEmojis ? 'Include relevant emojis throughout the content' : 'Do not use any emojis in the content'}
      - ${options.includeCTA ? 'Include a compelling call-to-action' : 'Do not include any call-to-action'}
      - ${options.includeHashtags ? 'Include relevant hashtags' : 'Do not include any hashtags'}
      ${customHashtagsText ? `- ${customHashtagsText}` : ''}
      ${avoidWordsText ? `- ${avoidWordsText}` : ''}
      
      Create the following variations:
      1. A more casual and conversational tone
      2. A data-driven, fact-focused approach
      3. A storytelling approach with a narrative structure
      4. A bold, provocative version that asks challenging questions
      
      For each variation:
      - Optimize specifically for ${platform} platform best practices
      - Use different hook styles and attention-grabbing techniques
      - Match the structure to ${contentType} format requirements
      ${options.maxLength ? `- Ensure all content is within ${options.maxLength} characters.` : ''}
      
      Return the result in JSON format with the following structure:
      {
        "variations": [
          {
            "title": "Casual variation title",
            "content": "Casual variation content"
          },
          {
            "title": "Data-driven variation title",
            "content": "Data-driven variation content"
          },
          {
            "title": "Storytelling variation title",
            "content": "Storytelling variation content"
          },
          {
            "title": "Bold/provocative variation title",
            "content": "Bold/provocative variation content"
          }
        ]
      }
    `;

    // Use OpenAI API with API key
    if (process.env.OPENAI_API_KEY) {
      const response = await openai.chat.completions.create({
        model: options.languageModel || "gpt-4o", // Use selected model or default to gpt-4o
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: options.creativity, // Use creativity setting from options
      });
      
      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result;
    }

    // Mock response when no API key is provided
    return {
      variations: [
        {
          title: `Casual take: ${baseContent.title}`,
          content: `Hey friends! 👋 Let's chat about ${baseContent.title.toLowerCase()}...
          
${baseContent.content.split('\n').slice(0, 2).join('\n')}

What's been your experience with this? Drop a comment below! 💬
#${platform.charAt(0).toUpperCase() + platform.slice(1)}Tips #ContentCreation`
        },
        {
          title: `The Data Behind ${baseContent.title}`,
          content: `FACT: Studies show that ${baseContent.title.toLowerCase()} can improve engagement by up to 45%.
          
Key findings:
1. ${baseContent.content.split('\n').find(line => line.length > 15) || "Strategic implementation is crucial"}
2. Top performers allocate 30% more resources to this area
3. ROI increases significantly after 90 days of consistent application

Learn more in our detailed guide (link in bio)
#DataDriven #ContentStrategy #Analytics`
        },
        {
          title: `The ${baseContent.title} Journey`,
          content: `It all started when our team realized we needed a better approach to ${baseContent.title.toLowerCase()}...
          
The challenge was real. We tried everything until we discovered that ${baseContent.content.split('\n').find(line => line.includes('1') || line.includes('first') || line.includes('key')) || "focusing on quality over quantity changed everything"}.

The results? Transformative.

Want to hear the full story? Let us know! ✨
#YourStory #ContentJourney`
        },
        {
          title: `Is Your ${baseContent.title} Strategy Actually HURTING You?`,
          content: `HARD TRUTH: Most ${baseContent.title.toLowerCase()} approaches are outdated and ineffective.
          
Are you still:
❌ ${baseContent.content.split('\n').find(line => !line.includes('✅') && line.length > 10) || "Following conventional wisdom?"}
❌ Ignoring the data that matters?
❌ Missing opportunities for genuine connection?

It's time to challenge assumptions. Are you ready?
#DisruptiveThinking #GameChanger`
        }
      ]
    };
  } catch (error) {
    console.error("Error generating variations:", error);
    throw new Error("Failed to generate more variations");
  }
}

// Mock content generator for demo
function generateMockContent(
  topic: string, 
  platform: Platform,
  tone: string
): { mainContent: ContentResponse; variations: ContentVariation[] } {
  const hashtags = "#ContentCreation #SocialMediaMarketing #DigitalStrategy";
  
  // Sample emojis based on tone
  const emojis = {
    "Professional": ["📊", "💼", "📈"],
    "Casual": ["👋", "😊", "✨"],
    "Enthusiastic": ["🔥", "💯", "🚀"],
    "Informative": ["📝", "📚", "💡"],
    "Humorous": ["😂", "🤣", "😜"]
  };
  
  // Get emojis for the selected tone or default to Professional
  const toneEmojis = emojis[tone as keyof typeof emojis] || emojis["Professional"];
  
  const mainContent: ContentResponse = {
    title: `5 ${topic} Strategies That Actually Drive Results ${toneEmojis[0]}`,
    content: `Struggling to see ROI from your ${topic} efforts? Here are 5 proven strategies that can transform your business:
      
1${toneEmojis[0]} Content that solves real problems
2${toneEmojis[1]} Data-driven decision making
3${toneEmojis[2]} Personalized customer journeys
4${toneEmojis[0]} Strategic social media presence
5${toneEmojis[1]} Continuous testing and optimization
      
Which one are you implementing first? Comment below! 👇
      
${hashtags}`
  };
  
  const variations: ContentVariation[] = [
    {
      title: `Ready to level up your ${topic} game? ${toneEmojis[2]}`,
      content: `We've compiled our top 5 ${topic} tactics that deliver REAL results:
      
1. Create customer-centric content
2. Let analytics guide your decisions
3. Build personalized experiences
4. Focus on quality over quantity on social
5. A/B test everything!
      
Which strategy are you most excited to try? Tell us below!
      
${hashtags}`
    },
    {
      title: `The ${topic} landscape changes fast, but these 5 strategies stand the test of time ⏱️`,
      content: `The ${topic} landscape changes fast, but these 5 strategies stand the test of time ⏱️
      
1. Problem-solving content
2. Data-informed strategy
3. Customer journey mapping
4. Strategic platform selection
5. Continuous optimization
      
Need help implementing these? Our team is just a DM away!
      
${hashtags}`
    }
  ];
  
  return { mainContent, variations };
}
