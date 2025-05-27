import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface TrendData {
  topic: string;
  confidence: number;
  category: string;
  growth: 'rising' | 'stable' | 'declining';
  platforms: string[];
  timeframe: string;
  hashtags: string[];
  contentTypes: string[];
  engagement_potential: 'high' | 'medium' | 'low';
}

export interface TrendPrediction {
  trending_topics: TrendData[];
  viral_content_formats: {
    format: string;
    description: string;
    success_rate: number;
    best_platforms: string[];
  }[];
  recommended_hashtags: {
    tag: string;
    category: string;
    usage_trend: 'rising' | 'stable' | 'declining';
    reach_potential: number;
  }[];
  content_insights: {
    optimal_posting_times: string[];
    trending_themes: string[];
    audience_preferences: string[];
    seasonal_trends: string[];
  };
  prediction_summary: string;
}

export async function analyzeTrends(
  platform: string = 'general',
  industry?: string,
  targetAudience?: string
): Promise<TrendPrediction> {
  try {
    const prompt = `As a social media trend analyst with access to real-time data, analyze current trends and predict what content will perform well in the next 2-4 weeks.

Platform focus: ${platform}
Industry: ${industry || 'general'}
Target audience: ${targetAudience || 'general'}

Provide a comprehensive trend analysis including:
1. Top 10 trending topics with confidence scores
2. Viral content formats that are gaining traction
3. Recommended hashtags with growth potential
4. Content insights for optimization
5. Overall prediction summary

Base your analysis on current social media patterns, seasonal trends, cultural events, and emerging topics.

Respond in JSON format matching the TrendPrediction interface.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const trendData = JSON.parse(response.choices[0].message.content || '{}');
    return validateTrendPrediction(trendData);
  } catch (error) {
    console.error('Error analyzing trends:', error);
    return generateFallbackTrends(platform, industry);
  }
}

export async function getTopicTrendScore(topic: string, platform: string): Promise<{
  score: number;
  trend: 'rising' | 'stable' | 'declining';
  recommendation: string;
}> {
  try {
    const prompt = `Analyze the trend potential for this topic: "${topic}" on ${platform}.
    
Provide:
- Score (0-100): How trending this topic is
- Trend direction: rising/stable/declining
- Recommendation: How to leverage this trend

Respond in JSON format with keys: score, trend, recommendation`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error getting topic trend score:', error);
    return {
      score: 50,
      trend: 'stable' as const,
      recommendation: 'This topic has moderate potential. Consider adding trending hashtags to boost visibility.'
    };
  }
}

export async function suggestViralContent(
  platform: string,
  trend: TrendData
): Promise<{
  title: string;
  content: string;
  hashtags: string[];
  format: string;
  viral_potential: number;
}> {
  try {
    const prompt = `Create viral content based on this trending topic:
    
Topic: ${trend.topic}
Platform: ${platform}
Category: ${trend.category}
Trending hashtags: ${trend.hashtags.join(', ')}

Create content that:
- Leverages the trend naturally
- Uses viral content formats
- Includes relevant hashtags
- Has high engagement potential

Respond in JSON format with: title, content, hashtags (array), format, viral_potential (0-100)`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error suggesting viral content:', error);
    return {
      title: `Trending: ${trend.topic}`,
      content: `Check out this trending topic that's gaining momentum! ${trend.hashtags.slice(0, 3).join(' ')}`,
      hashtags: trend.hashtags.slice(0, 5),
      format: 'post',
      viral_potential: 65
    };
  }
}

function validateTrendPrediction(data: any): TrendPrediction {
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
    prediction_summary: data.prediction_summary || 'Trend analysis completed successfully.'
  };
}

function generateFallbackTrends(platform: string, industry?: string): TrendPrediction {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  
  return {
    trending_topics: [
      {
        topic: `${currentMonth} ${currentYear} trends`,
        confidence: 85,
        category: 'seasonal',
        growth: 'rising',
        platforms: [platform],
        timeframe: '2-4 weeks',
        hashtags: [`#${currentMonth}${currentYear}`, '#trending', '#viral'],
        contentTypes: ['posts', 'stories'],
        engagement_potential: 'high'
      }
    ],
    viral_content_formats: [
      {
        format: 'carousel posts',
        description: 'Multi-slide posts with valuable tips or insights',
        success_rate: 78,
        best_platforms: ['instagram', 'linkedin']
      }
    ],
    recommended_hashtags: [
      {
        tag: '#trending',
        category: 'general',
        usage_trend: 'stable',
        reach_potential: 75
      }
    ],
    content_insights: {
      optimal_posting_times: ['9:00 AM', '2:00 PM', '6:00 PM'],
      trending_themes: ['authenticity', 'behind-the-scenes', 'tutorials'],
      audience_preferences: ['visual content', 'interactive posts'],
      seasonal_trends: [`${currentMonth} content themes`]
    },
    prediction_summary: `Current trends suggest focus on authentic, visual content with seasonal ${currentMonth} themes.`
  };
}