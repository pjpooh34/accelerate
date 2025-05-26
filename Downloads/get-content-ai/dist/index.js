// server/index.ts
import express3 from "express";
import session from "express-session";

// server/routes.ts
import express from "express";
import { createServer } from "http";
import Stripe from "stripe";

// server/storage.ts
var MemStorage = class {
  users;
  contents;
  savedContents;
  userCurrentId;
  contentCurrentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.contents = /* @__PURE__ */ new Map();
    this.savedContents = /* @__PURE__ */ new Map();
    this.userCurrentId = 1;
    this.contentCurrentId = 1;
    this.initializeTestUsers();
  }
  async initializeTestUsers() {
    const bcrypt2 = await import("bcryptjs");
    const hashedPassword = await bcrypt2.hash("password123", 10);
    const testUser = {
      id: 1,
      username: "pete",
      password: hashedPassword,
      email: "pete@test.com",
      firebaseId: null,
      photoURL: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: null,
      subscriptionEndDate: null,
      preferredAiModel: "openai",
      aiUsageCount: 0,
      aiUsageResetDate: null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(1, testUser);
    this.userCurrentId = 2;
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async getUserByFirebaseId(firebaseId) {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseId === firebaseId
    );
  }
  async createUser(insertUser) {
    const id = this.userCurrentId++;
    const user = {
      ...insertUser,
      id,
      firebaseId: insertUser.firebaseId || null,
      email: insertUser.email || null,
      photoURL: insertUser.photoURL || null,
      // Initialize subscription fields
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: "free",
      subscriptionEndDate: null,
      // Initialize AI model preferences
      preferredAiModel: "openai",
      aiUsageCount: 0,
      aiUsageResetDate: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, data) {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async saveContent(userId, contentId) {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    const content = await this.getContent(contentId);
    if (!content) {
      throw new Error(`Content with ID ${contentId} not found`);
    }
    const key = `${userId}-${contentId}`;
    this.savedContents.set(key, {
      userId,
      contentId,
      savedAt: /* @__PURE__ */ new Date()
    });
  }
  async unsaveContent(userId, contentId) {
    const key = `${userId}-${contentId}`;
    if (!this.savedContents.has(key)) {
      throw new Error(`Content with ID ${contentId} was not saved by user ${userId}`);
    }
    this.savedContents.delete(key);
  }
  async getSavedContent(userId) {
    const savedIds = Array.from(this.savedContents.entries()).filter(([_, saved]) => saved.userId === userId).map(([_, saved]) => saved.contentId);
    const savedContent = [];
    for (const id of savedIds) {
      const content = await this.getContent(id);
      if (content) {
        savedContent.push(content);
      }
    }
    return savedContent.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  async createContent(insertContent) {
    const id = this.contentCurrentId++;
    const content = {
      ...insertContent,
      id,
      userId: insertContent.userId || null,
      createdAt: /* @__PURE__ */ new Date(),
      category: insertContent.category || null
    };
    this.contents.set(id, content);
    return id;
  }
  async getAllContent() {
    return Array.from(this.contents.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  async getContent(id) {
    return this.contents.get(id);
  }
  async getUserContent(userId) {
    return Array.from(this.contents.values()).filter((content) => content.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  // Subscription management method implementations
  async updateStripeCustomerId(userId, customerId) {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, stripeCustomerId: customerId };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  async updateUserStripeInfo(userId, data) {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = {
      ...user,
      stripeCustomerId: data.customerId,
      stripeSubscriptionId: data.subscriptionId,
      subscriptionStatus: "active"
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  async updateSubscriptionStatus(userId, status, endDate) {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = {
      ...user,
      subscriptionStatus: status,
      subscriptionEndDate: endDate || null
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  async updateUserPreferences(userId, preferences) {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = {
      ...user,
      preferredAiModel: preferences.preferredAiModel || user.preferredAiModel
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  async incrementAiUsage(userId) {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = {
      ...user,
      aiUsageCount: (user.aiUsageCount || 0) + 1
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  async resetAiUsage(userId) {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = {
      ...user,
      aiUsageCount: 0,
      aiUsageResetDate: /* @__PURE__ */ new Date()
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
};
var storage = new MemStorage();

// server/ai-service.ts
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
var defaultAdvancedOptions = {
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
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
var anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});
async function generateSocialContent(topic2, tone, audience, platform, contentType, keywords, options = defaultAdvancedOptions, userSubscriptionStatus2 = "free") {
  if (options.languageModel === "claude") {
    return generateWithClaude(topic2, tone, audience, platform, contentType, keywords, options, userSubscriptionStatus2);
  } else {
    return generateWithOpenAI(topic2, tone, audience, platform, contentType, keywords, options, userSubscriptionStatus2);
  }
}
async function generateWithOpenAI(prompt, platform, contentType, targetAudience = "", options = defaultAdvancedOptions) {
  const platformLimits = {
    twitter: 280,
    instagram: 2200,
    facebook: 63206,
    linkedin: 3e3
  };
  const maxLength = Math.min(options.maxLength, platformLimits[platform]);
  const systemPrompt = `You are an expert social media content creator specializing in ${platform}. 
Create engaging, authentic content that drives real engagement and follows platform best practices.

Platform: ${platform}
Content Type: ${contentType}
Target Audience: ${targetAudience || "General audience"}
Style: ${options.contentStyle}
Character Limit: ${maxLength}

Requirements:
- ${options.includeEmojis ? "Include 2-3 relevant emojis naturally" : "No emojis"}
- ${options.includeCTA ? "Include compelling call-to-action" : "No call-to-action"}
- ${options.includeHashtags ? "Include 3-5 strategic hashtags" : "No hashtags"}
- Creativity level: ${options.creativity}/10
- Stay under ${maxLength} characters
${options.customHashtags.length ? `- Must include: ${options.customHashtags.join(", ")}` : ""}
${options.avoidWords.length ? `- Avoid: ${options.avoidWords.join(", ")}` : ""}

Generate content that feels authentic and valuable. Return JSON format:
{
  "mainContent": {"title": "Title", "content": "Main content"},
  "variations": [{"content": "Variation 1"}, {"content": "Variation 2"}, {"content": "Variation 3"}]
}`;
  const model = userSubscriptionStatus === "active" ? "gpt-4-turbo" : "gpt-3.5-turbo";
  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: options.creativity,
      response_format: { type: "json_object" }
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      mainContent: result.mainContent || { title: "Generated Content", content: "Content generated successfully" },
      variations: result.variations || []
    };
  } catch (error) {
    console.error("OpenAI generation error:", error);
    return generateFallbackContent(topic, platform, contentType);
  }
}
async function generateWithClaude(topic2, tone, audience, platform, contentType, keywords, options = defaultAdvancedOptions, userSubscriptionStatus2 = "free") {
  const platformLimits = {
    twitter: 280,
    instagram: 2200,
    facebook: 63206,
    linkedin: 3e3
  };
  const maxLength = Math.min(options.maxLength, platformLimits[platform]);
  const prompt = `Create ${contentType} content for ${platform} about "${topic2}".
    
Target audience: ${audience}
Tone: ${tone}
${keywords ? `Keywords to include: ${keywords}` : ""}
${options.customHashtags.length ? `Use these hashtags: ${options.customHashtags.join(", ")}` : ""}
${options.avoidWords.length ? `Avoid these words: ${options.avoidWords.join(", ")}` : ""}

Requirements:
- Maximum ${maxLength} characters
- Style: ${options.contentStyle}
- ${options.includeEmojis ? "Include relevant emojis" : "No emojis"}
- ${options.includeCTA ? "Include call-to-action" : "No call-to-action"}
- ${options.includeHashtags ? "Include relevant hashtags" : "No hashtags"}

Generate 1 main post and 3 variations. Respond only with valid JSON in this exact format:
{
  "mainContent": {"title": "Main Post Title", "content": "Main post content"},
  "variations": [
    {"content": "Variation 1"},
    {"content": "Variation 2"}, 
    {"content": "Variation 3"}
  ]
}`;
  const model = userSubscriptionStatus2 === "active" ? "claude-4-0" : "claude-3-7-sonnet-20250219";
  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
      temperature: options.creativity
    });
    const textContent = response.content.find((block) => block.type === "text");
    const result = JSON.parse(textContent?.text || "{}");
    return {
      mainContent: result.mainContent || { title: "Generated Content", content: "Content generated successfully" },
      variations: result.variations || []
    };
  } catch (error) {
    console.error("Claude generation error:", error);
    return generateFallbackContent(topic2, platform, contentType);
  }
}
function generateFallbackContent(topic2, platform, contentType) {
  const mainContent = {
    title: `${contentType} for ${platform}`,
    content: `Check out this amazing content about ${topic2}! \u{1F680} #ContentCreation #SocialMedia`
  };
  const variations = [
    { content: `Discover the power of ${topic2}! Perfect for your ${platform} strategy. \u2728` },
    { content: `${topic2} is trending! Don't miss out on this incredible opportunity. \u{1F525}` },
    { content: `Transform your ${platform} presence with ${topic2}. Start today! \u{1F4AA}` }
  ];
  return { mainContent, variations };
}
async function generateMoreVariations(platform, contentType, baseContent, options = defaultAdvancedOptions) {
  const prompt = `Based on this ${platform} ${contentType}: "${baseContent.content}"
  
Generate 3 more creative variations with similar style and message.
Keep the same tone and key elements but make each unique.
Maximum ${options.maxLength} characters each.

Respond with JSON array: [{"content": "variation 1"}, {"content": "variation 2"}, {"content": "variation 3"}]`;
  try {
    if (options.languageModel === "claude") {
      const response = await anthropic.messages.create({
        model: "claude-4-0",
        // Latest Claude 4.0 model
        max_tokens: 512,
        messages: [{ role: "user", content: prompt }],
        temperature: options.creativity
      });
      const textContent = response.content.find((block) => block.type === "text");
      return JSON.parse(textContent?.text || "[]");
    } else {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: options.creativity,
        response_format: { type: "json_object" }
      });
      const result = JSON.parse(response.choices[0].message.content || "[]");
      return Array.isArray(result) ? result : result.variations || [];
    }
  } catch (error) {
    console.error("AI variation generation error:", error);
    return [
      { content: `Another great take on ${baseContent.title}! \u{1F31F}` },
      { content: `${baseContent.title} - reimagined for maximum impact! \u{1F4AB}` },
      { content: `Fresh perspective on ${baseContent.title}. Love it! \u2764\uFE0F` }
    ];
  }
}

// server/social-media-api.ts
async function postToInstagram(content) {
  if (!process.env.INSTAGRAM_ACCESS_TOKEN) {
    return { success: false, error: "Instagram access token not configured" };
  }
  try {
    const mediaData = {
      caption: content.text,
      access_token: process.env.INSTAGRAM_ACCESS_TOKEN
    };
    if (content.imageUrl) {
      mediaData.image_url = content.imageUrl;
    }
    const containerResponse = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mediaData)
      }
    );
    const containerData = await containerResponse.json();
    if (!containerResponse.ok) {
      return { success: false, error: containerData.error?.message || "Failed to create Instagram media container" };
    }
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: containerData.id,
          access_token: process.env.INSTAGRAM_ACCESS_TOKEN
        })
      }
    );
    const publishData = await publishResponse.json();
    if (!publishResponse.ok) {
      return { success: false, error: publishData.error?.message || "Failed to publish Instagram post" };
    }
    return {
      success: true,
      postId: publishData.id,
      platformUrl: `https://www.instagram.com/p/${publishData.id}/`
    };
  } catch (error) {
    return { success: false, error: `Instagram posting failed: ${error.message}` };
  }
}
async function postToTwitter(content) {
  if (!process.env.TWITTER_BEARER_TOKEN) {
    return { success: false, error: "Twitter Bearer token not configured" };
  }
  try {
    const tweetData = {
      text: content.text
    };
    if (content.imageBase64) {
      const mediaResponse = await fetch("https://upload.twitter.com/1.1/media/upload.json", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          media_data: content.imageBase64,
          media_category: "TWEET_IMAGE"
        })
      });
      const mediaData = await mediaResponse.json();
      if (mediaResponse.ok && mediaData.media_id_string) {
        tweetData.media = { media_ids: [mediaData.media_id_string] };
      }
    }
    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tweetData)
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.detail || "Failed to post to Twitter" };
    }
    return {
      success: true,
      postId: data.data.id,
      platformUrl: `https://twitter.com/user/status/${data.data.id}`
    };
  } catch (error) {
    return { success: false, error: `Twitter posting failed: ${error.message}` };
  }
}
async function postToFacebook(content) {
  if (!process.env.FACEBOOK_PAGE_ACCESS_TOKEN) {
    return { success: false, error: "Facebook page access token not configured" };
  }
  try {
    const postData = {
      message: content.text,
      access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN
    };
    if (content.imageUrl) {
      postData.link = content.imageUrl;
    }
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.FACEBOOK_PAGE_ID}/feed`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error?.message || "Failed to post to Facebook" };
    }
    return {
      success: true,
      postId: data.id,
      platformUrl: `https://www.facebook.com/${data.id}`
    };
  } catch (error) {
    return { success: false, error: `Facebook posting failed: ${error.message}` };
  }
}
async function postToLinkedIn(content) {
  if (!process.env.LINKEDIN_ACCESS_TOKEN) {
    return { success: false, error: "LinkedIn access token not configured" };
  }
  try {
    const postData = {
      author: `urn:li:person:${process.env.LINKEDIN_PERSON_ID}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: content.text
          },
          shareMediaCategory: content.imageUrl ? "IMAGE" : "NONE",
          ...content.imageUrl && {
            media: [{
              status: "READY",
              description: {
                text: "Shared via Get Content AI"
              },
              media: content.imageUrl,
              title: {
                text: "AI Generated Content"
              }
            }]
          }
        }
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    };
    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0"
      },
      body: JSON.stringify(postData)
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.message || "Failed to post to LinkedIn" };
    }
    return {
      success: true,
      postId: data.id,
      platformUrl: `https://www.linkedin.com/feed/update/${data.id}/`
    };
  } catch (error) {
    return { success: false, error: `LinkedIn posting failed: ${error.message}` };
  }
}
async function postToSocialMedia(platform, content) {
  switch (platform) {
    case "instagram":
      return postToInstagram(content);
    case "twitter":
      return postToTwitter(content);
    case "facebook":
      return postToFacebook(content);
    case "linkedin":
      return postToLinkedIn(content);
    default:
      return { success: false, error: `Unsupported platform: ${platform}` };
  }
}

// server/trend-predictor.ts
import OpenAI2 from "openai";
var openai2 = new OpenAI2({ apiKey: process.env.OPENAI_API_KEY });
async function analyzeTrends(platform = "general", industry, targetAudience) {
  try {
    const prompt = `As a social media trend analyst with access to real-time data, analyze current trends and predict what content will perform well in the next 2-4 weeks.

Platform focus: ${platform}
Industry: ${industry || "general"}
Target audience: ${targetAudience || "general"}

Provide a comprehensive trend analysis including:
1. Top 10 trending topics with confidence scores
2. Viral content formats that are gaining traction
3. Recommended hashtags with growth potential
4. Content insights for optimization
5. Overall prediction summary

Base your analysis on current social media patterns, seasonal trends, cultural events, and emerging topics.

Respond in JSON format matching the TrendPrediction interface.`;
    const response = await openai2.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7
    });
    const trendData = JSON.parse(response.choices[0].message.content || "{}");
    return validateTrendPrediction(trendData);
  } catch (error) {
    console.error("Error analyzing trends:", error);
    return generateFallbackTrends(platform, industry);
  }
}
async function getTopicTrendScore(topic2, platform) {
  try {
    const prompt = `Analyze the trend potential for this topic: "${topic2}" on ${platform}.
    
Provide:
- Score (0-100): How trending this topic is
- Trend direction: rising/stable/declining
- Recommendation: How to leverage this trend

Respond in JSON format with keys: score, trend, recommendation`;
    const response = await openai2.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.5
    });
    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error getting topic trend score:", error);
    return {
      score: 50,
      trend: "stable",
      recommendation: "This topic has moderate potential. Consider adding trending hashtags to boost visibility."
    };
  }
}
async function suggestViralContent(platform, trend) {
  try {
    const prompt = `Create viral content based on this trending topic:
    
Topic: ${trend.topic}
Platform: ${platform}
Category: ${trend.category}
Trending hashtags: ${trend.hashtags.join(", ")}

Create content that:
- Leverages the trend naturally
- Uses viral content formats
- Includes relevant hashtags
- Has high engagement potential

Respond in JSON format with: title, content, hashtags (array), format, viral_potential (0-100)`;
    const response = await openai2.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8
    });
    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error suggesting viral content:", error);
    return {
      title: `Trending: ${trend.topic}`,
      content: `Check out this trending topic that's gaining momentum! ${trend.hashtags.slice(0, 3).join(" ")}`,
      hashtags: trend.hashtags.slice(0, 5),
      format: "post",
      viral_potential: 65
    };
  }
}
function validateTrendPrediction(data) {
  return {
    trending_topics: data.trending_topics || [],
    viral_content_formats: data.viral_content_formats || [],
    recommended_hashtags: data.recommended_hashtags || [],
    content_insights: data.content_insights || {
      optimal_posting_times: [],
      trending_themes: [],
      audience_preferences: [],
      seasonal_trends: []
    },
    prediction_summary: data.prediction_summary || "Trend analysis completed successfully."
  };
}
function generateFallbackTrends(platform, industry) {
  const currentMonth = (/* @__PURE__ */ new Date()).toLocaleString("default", { month: "long" });
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return {
    trending_topics: [
      {
        topic: `${currentMonth} ${currentYear} trends`,
        confidence: 85,
        category: "seasonal",
        growth: "rising",
        platforms: [platform],
        timeframe: "2-4 weeks",
        hashtags: [`#${currentMonth}${currentYear}`, "#trending", "#viral"],
        contentTypes: ["posts", "stories"],
        engagement_potential: "high"
      }
    ],
    viral_content_formats: [
      {
        format: "carousel posts",
        description: "Multi-slide posts with valuable tips or insights",
        success_rate: 78,
        best_platforms: ["instagram", "linkedin"]
      }
    ],
    recommended_hashtags: [
      {
        tag: "#trending",
        category: "general",
        usage_trend: "stable",
        reach_potential: 75
      }
    ],
    content_insights: {
      optimal_posting_times: ["9:00 AM", "2:00 PM", "6:00 PM"],
      trending_themes: ["authenticity", "behind-the-scenes", "tutorials"],
      audience_preferences: ["visual content", "interactive posts"],
      seasonal_trends: [`${currentMonth} content themes`]
    },
    prediction_summary: `Current trends suggest focus on authentic, visual content with seasonal ${currentMonth} themes.`
  };
}

// server/performance-predictor.ts
import OpenAI3 from "openai";
var openai3 = new OpenAI3({ apiKey: process.env.OPENAI_API_KEY });
async function predictContentPerformance(request) {
  try {
    const prompt = `As an AI content performance analyst with access to social media engagement data, analyze this content and predict its performance:

Content: "${request.content}"
Platform: ${request.platform}
Content Type: ${request.contentType}
Target Audience: ${request.targetAudience || "general"}
Hashtags: ${request.hashtags?.join(", ") || "none"}
Industry: ${request.industry || "general"}

Analyze the content for:
1. Viral potential (trending topics, shareability, emotional triggers)
2. Engagement factors (calls-to-action, questions, relatability)
3. Platform optimization (format, length, style for ${request.platform})
4. Audience appeal for ${request.targetAudience || "general audience"}
5. Hashtag effectiveness and reach potential
6. Predicted performance metrics

Provide detailed analysis with specific scores (0-100) and actionable insights.

Respond in JSON format matching the PerformancePrediction interface with realistic metric predictions based on content quality and platform algorithms.`;
    const response = await openai3.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3
    });
    const prediction = JSON.parse(response.choices[0].message.content || "{}");
    return validatePrediction(prediction);
  } catch (error) {
    console.error("Error predicting content performance:", error);
    return generateFallbackPrediction(request);
  }
}
async function compareContentVersions(originalContent, improvedContent, platform) {
  try {
    const [originalPrediction, improvedPrediction] = await Promise.all([
      predictContentPerformance({
        content: originalContent,
        platform,
        contentType: "post"
      }),
      predictContentPerformance({
        content: improvedContent,
        platform,
        contentType: "post"
      })
    ]);
    const improvementPercentage = Math.round(
      (improvedPrediction.overallScore - originalPrediction.overallScore) / originalPrediction.overallScore * 100
    );
    const recommendation = improvementPercentage > 10 ? "The improved version shows significant performance gains. Recommend using the updated content." : improvementPercentage > 0 ? "The improved version shows moderate gains. Consider the changes worthwhile." : "The original content performs better. Stick with the original version.";
    return {
      original: originalPrediction,
      improved: improvedPrediction,
      improvement_percentage: improvementPercentage,
      recommendation
    };
  } catch (error) {
    console.error("Error comparing content versions:", error);
    throw new Error("Failed to compare content versions");
  }
}
async function generatePerformanceReport(contentHistory) {
  try {
    const predictions = await Promise.all(
      contentHistory.slice(-10).map(
        (item) => predictContentPerformance({
          content: item.content,
          platform: item.platform,
          contentType: "post"
        })
      )
    );
    const averageScore = predictions.reduce((sum, p) => sum + p.overallScore, 0) / predictions.length;
    const topScore = Math.max(...predictions.map((p) => p.overallScore));
    const topPerformingIndex = predictions.findIndex((p) => p.overallScore === topScore);
    const topPerformingContent = contentHistory[topPerformingIndex]?.content || "N/A";
    const recommendations = [
      "Focus on emotional triggers and storytelling elements",
      "Include clear calls-to-action to boost engagement",
      "Optimize posting times based on audience activity",
      "Use trending hashtags relevant to your industry",
      "Create platform-specific content formats"
    ];
    const trends = [
      "Short-form video content is gaining traction",
      "User-generated content drives higher engagement",
      "Behind-the-scenes content builds authenticity",
      "Interactive polls and questions boost participation"
    ];
    return {
      averageScore: Math.round(averageScore),
      topPerformingContent,
      recommendations,
      trends
    };
  } catch (error) {
    console.error("Error generating performance report:", error);
    throw new Error("Failed to generate performance report");
  }
}
function validatePrediction(data) {
  return {
    overallScore: Math.min(100, Math.max(0, data.overallScore || 75)),
    viralPotential: Math.min(100, Math.max(0, data.viralPotential || 65)),
    engagementScore: Math.min(100, Math.max(0, data.engagementScore || 70)),
    reachPotential: Math.min(100, Math.max(0, data.reachPotential || 68)),
    platformOptimization: {
      instagram: Math.min(100, Math.max(0, data.platformOptimization?.instagram || 70)),
      twitter: Math.min(100, Math.max(0, data.platformOptimization?.twitter || 65)),
      facebook: Math.min(100, Math.max(0, data.platformOptimization?.facebook || 60)),
      linkedin: Math.min(100, Math.max(0, data.platformOptimization?.linkedin || 55))
    },
    insights: {
      strengths: data.insights?.strengths || ["Engaging content structure", "Clear messaging"],
      improvements: data.insights?.improvements || ["Add more calls-to-action", "Include trending hashtags"],
      audience_appeal: data.insights?.audience_appeal || "Moderate appeal to target audience",
      timing_suggestion: data.insights?.timing_suggestion || "Post during peak engagement hours (7-9 PM)",
      hashtag_effectiveness: Math.min(100, Math.max(0, data.insights?.hashtag_effectiveness || 60))
    },
    predicted_metrics: {
      likes: { min: data.predicted_metrics?.likes?.min || 50, max: data.predicted_metrics?.likes?.max || 200 },
      shares: { min: data.predicted_metrics?.shares?.min || 10, max: data.predicted_metrics?.shares?.max || 50 },
      comments: { min: data.predicted_metrics?.comments?.min || 5, max: data.predicted_metrics?.comments?.max || 25 },
      reach: { min: data.predicted_metrics?.reach?.min || 500, max: data.predicted_metrics?.reach?.max || 2e3 }
    },
    confidence_level: Math.min(100, Math.max(0, data.confidence_level || 80)),
    analysis_summary: data.analysis_summary || "Content shows good potential with room for optimization."
  };
}
function generateFallbackPrediction(request) {
  const baseScore = 65;
  const platformBonus = request.platform === "instagram" ? 10 : request.platform === "twitter" ? 5 : 0;
  return {
    overallScore: baseScore + platformBonus,
    viralPotential: 60,
    engagementScore: 65,
    reachPotential: 62,
    platformOptimization: {
      instagram: request.platform === "instagram" ? 85 : 60,
      twitter: request.platform === "twitter" ? 80 : 55,
      facebook: request.platform === "facebook" ? 75 : 50,
      linkedin: request.platform === "linkedin" ? 70 : 45
    },
    insights: {
      strengths: ["Clear messaging", "Appropriate length"],
      improvements: ["Add emotional triggers", "Include call-to-action"],
      audience_appeal: "Good appeal to general audience",
      timing_suggestion: "Post during peak hours (6-8 PM)",
      hashtag_effectiveness: 65
    },
    predicted_metrics: {
      likes: { min: 30, max: 150 },
      shares: { min: 5, max: 30 },
      comments: { min: 3, max: 15 },
      reach: { min: 300, max: 1200 }
    },
    confidence_level: 75,
    analysis_summary: "Content analysis completed with moderate confidence. Consider optimizing for better performance."
  };
}

// shared/schema.ts
import { pgTable, text, serial, timestamp, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  // Google authentication fields
  firebaseId: text("firebase_id").unique(),
  email: text("email"),
  photoURL: text("photo_url"),
  // Stripe subscription fields
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  subscriptionStatus: text("subscription_status").default("free"),
  // free, active, past_due, canceled
  subscriptionEndDate: timestamp("subscription_end_date"),
  // AI model preferences
  preferredAiModel: text("preferred_ai_model").default("openai"),
  // openai, claude
  aiUsageCount: integer("ai_usage_count").default(0),
  aiUsageResetDate: timestamp("ai_usage_reset_date").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
}).extend({
  firebaseId: z.string().optional(),
  email: z.string().email().optional(),
  photoURL: z.string().url().optional()
});
var contents = pgTable("contents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  platform: varchar("platform", { length: 20 }).notNull(),
  contentType: varchar("content_type", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  category: text("category"),
  imageUrl: text("image_url"),
  isPosted: boolean("is_posted").notNull().default(false),
  postId: text("post_id"),
  platformUrl: text("platform_url"),
  postedAt: timestamp("posted_at")
});
var insertContentSchema = createInsertSchema(contents).omit({ id: true, createdAt: true, isPosted: true, postId: true, platformUrl: true, postedAt: true }).extend({
  userId: z.number().nullable().optional(),
  category: z.string().optional()
});
var savedContents = pgTable("saved_contents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  contentId: integer("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  savedAt: timestamp("saved_at").notNull().defaultNow()
});
var insertSavedContentSchema = createInsertSchema(savedContents).omit({ id: true, savedAt: true });
var advancedOptionsSchema = z.object({
  creativity: z.number().min(0).max(1).default(0.7),
  maxLength: z.number().min(10).max(2e3).default(280),
  includeEmojis: z.boolean().default(true),
  includeCTA: z.boolean().default(true),
  includeHashtags: z.boolean().default(true),
  customHashtags: z.array(z.string()).default([]),
  avoidWords: z.array(z.string()).default([]),
  contentStyle: z.string().default("balanced"),
  languageModel: z.enum(["openai", "claude"]).default("openai")
}).optional().default({
  creativity: 0.7,
  maxLength: 280,
  includeEmojis: true,
  includeCTA: true,
  includeHashtags: true,
  customHashtags: [],
  avoidWords: [],
  contentStyle: "balanced",
  languageModel: "openai"
});
var subscriptionPlanSchema = z.object({
  plan: z.enum(["free", "pro"])
});
var updateUserPreferencesSchema = z.object({
  preferredAiModel: z.enum(["openai", "claude"]).optional()
});
var generateContentSchema = z.object({
  topic: z.string().min(3).max(100),
  tone: z.string(),
  keywords: z.string().optional(),
  audience: z.string(),
  platform: z.enum(["instagram", "twitter", "facebook", "linkedin"]),
  contentType: z.enum(["postWithImage", "carousel", "story", "textOnly"]),
  category: z.string().optional(),
  advancedOptions: advancedOptionsSchema.optional()
});
var generateMoreVariationsSchema = z.object({
  platform: z.enum(["instagram", "twitter", "facebook", "linkedin"]),
  contentType: z.enum(["postWithImage", "carousel", "story", "textOnly"]),
  baseContent: z.object({
    title: z.string(),
    content: z.string()
  }),
  advancedOptions: advancedOptionsSchema
});
var saveContentSchema = z.object({
  contentId: z.number()
});
var unsaveContentSchema = z.object({
  contentId: z.number()
});
var postToSocialMediaSchema = z.object({
  contentId: z.number(),
  platform: z.enum(["instagram", "twitter", "facebook", "linkedin"]),
  imageUrl: z.string().optional()
});

// server/routes.ts
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// server/auth.ts
import { z as z2 } from "zod";
import bcrypt from "bcryptjs";
var loginSchema = z2.object({
  username: z2.string().min(3),
  password: z2.string().min(6)
});
function isAuthenticated(req, res, next) {
  const session2 = req.session;
  if (session2 && session2.userId) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}
var googleAuthSchema = z2.object({
  firebaseId: z2.string(),
  username: z2.string(),
  email: z2.string().email().optional(),
  photoURL: z2.string().url().optional()
});
var profileUpdateSchema = z2.object({
  username: z2.string().min(3),
  email: z2.string().email().optional().nullable()
});
var authController = {
  // Update user profile
  async updateProfile(req, res) {
    try {
      const session2 = req.session;
      const userId = session2.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const validatedData = profileUpdateSchema.parse(req.body);
      if (validatedData.username) {
        const existingUser = await storage.getUserByUsername(validatedData.username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ message: "Username is already taken" });
        }
      }
      const updatedUser = await storage.updateUser(userId, {
        username: validatedData.username,
        email: validatedData.email || null
      });
      res.json({
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        photoURL: updatedUser.photoURL,
        firebaseId: updatedUser.firebaseId
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Server error during profile update" });
    }
  },
  // Google authentication/registration
  async googleAuth(req, res) {
    try {
      const validatedData = googleAuthSchema.parse(req.body);
      let user = await storage.getUserByFirebaseId(validatedData.firebaseId);
      if (!user) {
        user = await storage.createUser({
          username: validatedData.username,
          password: "",
          // No password for Google users
          firebaseId: validatedData.firebaseId,
          email: validatedData.email,
          photoURL: validatedData.photoURL
        });
      }
      const session2 = req.session;
      session2.userId = user.id;
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        photoURL: user.photoURL
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Google authentication error:", error);
      res.status(500).json({ message: "Server error during Google authentication" });
    }
  },
  // Register a new user
  async register(req, res) {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username is already taken" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(validatedData.password, salt);
      const user = await storage.createUser({
        username: validatedData.username,
        password: hashedPassword
      });
      const session2 = req.session;
      session2.userId = user.id;
      res.status(201).json({
        id: user.id,
        username: user.username
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error during registration" });
    }
  },
  // Login user
  async login(req, res) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(validatedData.username);
      if (!user) {
        return res.status(400).json({ message: "Invalid username or password" });
      }
      const isMatch = await bcrypt.compare(validatedData.password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid username or password" });
      }
      const session2 = req.session;
      session2.userId = user.id;
      res.json({
        id: user.id,
        username: user.username
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  },
  // Get current user
  async getCurrentUser(req, res) {
    try {
      const session2 = req.session;
      const userId = session2.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        id: user.id,
        username: user.username
      });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  // Logout user
  async logout(req, res) {
    const session2 = req.session;
    session2.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  }
};

// server/routes.ts
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
}
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16"
});
async function registerRoutes(app2) {
  app2.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        // Convert to cents
        currency: "usd"
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });
  app2.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        const subscription = event.data.object;
        const userId = subscription.metadata.userId;
        if (userId) {
          await storage.updateSubscriptionStatus(parseInt(userId), subscription.status);
        }
        break;
      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object;
        const deletedUserId = deletedSubscription.metadata.userId;
        if (deletedUserId) {
          await storage.updateSubscriptionStatus(parseInt(deletedUserId), "canceled");
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
  });
  app2.post("/api/get-or-create-subscription", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      let user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.stripeSubscriptionId) {
        try {
          const subscription2 = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          if (subscription2.status === "active") {
            return res.json({
              subscriptionId: subscription2.id,
              clientSecret: null,
              alreadySubscribed: true,
              status: "active"
            });
          }
        } catch (error) {
          console.log("Existing subscription not found, creating new one");
        }
      }
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email || `${user.username}@temp.local`,
          name: user.username,
          metadata: {
            userId: user.id.toString()
          }
        });
        customerId = customer.id;
        user = await storage.updateStripeCustomerId(user.id, customerId);
      }
      const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || "price_1RRwXbCBvWyiQcuHbKNiwifd";
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: STRIPE_PRICE_ID
        }],
        payment_behavior: "default_incomplete",
        payment_settings: {
          save_default_payment_method: "on_subscription"
        },
        expand: ["latest_invoice.payment_intent"],
        metadata: {
          userId: user.id.toString()
        }
      });
      await storage.updateUserStripeInfo(user.id, {
        customerId,
        subscriptionId: subscription.id
      });
      const invoice = subscription.latest_invoice;
      const paymentIntent = invoice?.payment_intent;
      console.log("Subscription created successfully:", subscription.id);
      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent?.client_secret,
        status: subscription.status
      });
    } catch (error) {
      console.error("Subscription creation error:", error);
      return res.status(500).json({ error: error.message || "Failed to create subscription" });
    }
  });
  app2.post("/api/user/preferences", isAuthenticated, async (req, res) => {
    try {
      const validatedData = updateUserPreferencesSchema.parse(req.body);
      const session2 = req.session;
      const userId = session2?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const updatedUser = await storage.updateUserPreferences(userId, validatedData);
      res.json({ success: true, user: updatedUser });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).toString() });
      }
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/auth/signup", authController.register);
  app2.post("/api/auth/login", authController.login);
  app2.post("/api/auth/google", authController.googleAuth);
  app2.get("/api/auth/me", authController.getCurrentUser);
  app2.post("/api/auth/profile", isAuthenticated, authController.updateProfile);
  app2.post("/api/auth/logout", authController.logout);
  app2.post("/api/generate", async (req, res) => {
    try {
      const validatedData = generateContentSchema.parse(req.body);
      const session2 = req.session;
      const userId = session2?.userId;
      if (!userId) {
        const guestUsageKey = `guest_usage_${req.ip}`;
        if (session2[guestUsageKey] >= 1) {
          return res.status(429).json({
            error: "Guest limit reached. Please create an account to continue generating content.",
            requiresSignup: true
          });
        }
        session2[guestUsageKey] = (session2[guestUsageKey] || 0) + 1;
      } else {
        const user = await storage.getUser(userId);
        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }
        if (user.subscriptionStatus !== "active") {
          if (user.aiUsageCount >= 5) {
            return res.status(429).json({
              error: "Free plan limit reached (5/5 generations). Upgrade to Pro for unlimited content generation.",
              requiresUpgrade: true,
              usageCount: user.aiUsageCount,
              usageLimit: 5
            });
          }
        }
        await storage.incrementAiUsage(userId);
      }
      const result = await generateSocialContent(
        validatedData.prompt || validatedData.topic,
        validatedData.platform,
        validatedData.contentType,
        validatedData.targetAudience || validatedData.audience || "",
        validatedData.advancedOptions || {}
      );
      const contentId = await storage.createContent({
        title: result.mainContent.title,
        content: result.mainContent.content,
        platform: validatedData.platform,
        contentType: validatedData.contentType,
        userId: userId || null
      });
      res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Error generating content:", error);
        res.status(500).json({ message: "Failed to generate content" });
      }
    }
  });
  app2.post("/api/generate/more", async (req, res) => {
    try {
      const validatedData = generateMoreVariationsSchema.parse(req.body);
      const result = await generateMoreVariations(
        validatedData.platform,
        validatedData.contentType,
        validatedData.baseContent,
        validatedData.advancedOptions
      );
      res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Error generating variations:", error);
        res.status(500).json({ message: "Failed to generate more variations" });
      }
    }
  });
  app2.get("/api/content", async (req, res) => {
    try {
      const contents2 = await storage.getAllContent();
      res.json(contents2);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content history" });
    }
  });
  app2.get("/api/user/content", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const contents2 = await storage.getUserContent(userId);
      res.json(contents2);
    } catch (error) {
      console.error("Error fetching user content:", error);
      res.status(500).json({ message: "Failed to fetch user content history" });
    }
  });
  app2.post("/api/content/save", isAuthenticated, async (req, res) => {
    try {
      const data = saveContentSchema.parse(req.body);
      const userId = req.session.userId;
      await storage.saveContent(userId, data.contentId);
      res.json({ success: true, message: "Content saved successfully" });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Error saving content:", error);
        res.status(500).json({ message: "Failed to save content" });
      }
    }
  });
  app2.get("/api/content/saved", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const savedContent = await storage.getSavedContent(userId);
      res.json(savedContent);
    } catch (error) {
      console.error("Error fetching saved content:", error);
      res.status(500).json({ message: "Failed to fetch saved content" });
    }
  });
  app2.post("/api/content/unsave", isAuthenticated, async (req, res) => {
    try {
      const data = unsaveContentSchema.parse(req.body);
      const userId = req.session.userId;
      await storage.unsaveContent(userId, data.contentId);
      res.json({ success: true, message: "Content removed from favorites" });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Error removing from favorites:", error);
        res.status(500).json({ message: "Failed to remove content from favorites" });
      }
    }
  });
  app2.post("/api/content/post", isAuthenticated, async (req, res) => {
    try {
      const { contentId, platform, imageUrl } = postToSocialMediaSchema.parse(req.body);
      const user = req.user;
      const content = await storage.getContent(contentId);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      if (content.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      const postContent = {
        text: content.content,
        imageUrl: imageUrl || content.imageUrl
      };
      const result = await postToSocialMedia(platform, postContent);
      if (result.success) {
        res.json({
          success: true,
          postId: result.postId,
          platformUrl: result.platformUrl,
          message: `Successfully posted to ${platform}!`
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
          message: `Failed to post to ${platform}: ${result.error}`
        });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      console.error("Error posting to social media:", error);
      res.status(500).json({ message: "Failed to post to social media" });
    }
  });
  app2.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt, platform, dimensions } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: `${prompt}. Optimized for ${platform} social media platform.`,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          style: "vivid"
        })
      });
      const data = await response.json();
      if (!response.ok) {
        return res.status(400).json({
          message: data.error?.message || "Failed to generate image"
        });
      }
      res.json({
        success: true,
        imageUrl: data.data[0].url,
        platform,
        dimensions
      });
    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ message: "Failed to generate image" });
    }
  });
  app2.get("/api/trends", async (req, res) => {
    try {
      const { platform, industry, audience } = req.query;
      const trends = await analyzeTrends(
        platform,
        industry,
        audience
      );
      res.json(trends);
    } catch (error) {
      console.error("Trend analysis error:", error);
      res.status(500).json({ message: "Failed to analyze trends: " + error.message });
    }
  });
  app2.post("/api/trends/topic-score", async (req, res) => {
    try {
      const { topic: topic2, platform } = req.body;
      if (!topic2 || !platform) {
        return res.status(400).json({ message: "Topic and platform are required" });
      }
      const score = await getTopicTrendScore(topic2, platform);
      res.json(score);
    } catch (error) {
      console.error("Topic trend score error:", error);
      res.status(500).json({ message: "Failed to get topic score: " + error.message });
    }
  });
  app2.post("/api/trends/viral-content", async (req, res) => {
    try {
      const { platform, trend } = req.body;
      if (!platform || !trend) {
        return res.status(400).json({ message: "Platform and trend data are required" });
      }
      const viralContent = await suggestViralContent(platform, trend);
      res.json(viralContent);
    } catch (error) {
      console.error("Viral content suggestion error:", error);
      res.status(500).json({ message: "Failed to suggest viral content: " + error.message });
    }
  });
  app2.post("/api/performance/predict", async (req, res) => {
    try {
      const { content, platform, contentType, targetAudience, hashtags, postingTime, industry } = req.body;
      if (!content || !platform) {
        return res.status(400).json({ message: "Content and platform are required" });
      }
      const prediction = await predictContentPerformance({
        content,
        platform,
        contentType: contentType || "post",
        targetAudience,
        hashtags,
        postingTime,
        industry
      });
      res.json(prediction);
    } catch (error) {
      console.error("Performance prediction error:", error);
      res.status(500).json({ message: "Failed to predict content performance: " + error.message });
    }
  });
  app2.post("/api/performance/compare", async (req, res) => {
    try {
      const { originalContent, improvedContent, platform } = req.body;
      if (!originalContent || !improvedContent || !platform) {
        return res.status(400).json({ message: "Original content, improved content, and platform are required" });
      }
      const comparison = await compareContentVersions(
        originalContent,
        improvedContent,
        platform
      );
      res.json(comparison);
    } catch (error) {
      console.error("Content comparison error:", error);
      res.status(500).json({ message: "Failed to compare content versions: " + error.message });
    }
  });
  app2.post("/api/performance/report", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const userContent = await storage.getUserContent(userId);
      const contentHistory = userContent.map((item) => ({
        content: item.content,
        platform: item.platform,
        actualMetrics: null
        // Could be populated with real metrics if available
      }));
      const report = await generatePerformanceReport(contentHistory);
      res.json(report);
    } catch (error) {
      console.error("Performance report error:", error);
      res.status(500).json({ message: "Failed to generate performance report: " + error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express3();
app.use(
  session({
    secret: process.env.SESSION_SECRET || "get-content-ai-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1e3 * 60 * 60 * 24 * 7
      // 1 week
    }
  })
);
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
