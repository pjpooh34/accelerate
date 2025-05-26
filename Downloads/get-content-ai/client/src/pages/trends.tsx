import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, Sparkles, Target, Clock, Hash, Zap, BarChart3 } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface TrendData {
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

interface TrendPrediction {
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

export default function TrendsPage() {
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [industry, setIndustry] = useState('');
  const [audience, setAudience] = useState('');
  const [topicToCheck, setTopicToCheck] = useState('');
  const { toast } = useToast();

  const { data: trends, isLoading, refetch } = useQuery({
    queryKey: ['/api/trends', selectedPlatform, industry, audience],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedPlatform) params.append('platform', selectedPlatform);
      if (industry) params.append('industry', industry);
      if (audience) params.append('audience', audience);
      
      const response = await fetch(`/api/trends?${params}`);
      if (!response.ok) throw new Error('Failed to fetch trends');
      return response.json() as Promise<TrendPrediction>;
    }
  });

  const topicScoreMutation = useMutation({
    mutationFn: async ({ topic, platform }: { topic: string; platform: string }) => {
      return await apiRequest('POST', '/api/trends/topic-score', { topic, platform });
    },
    onSuccess: (data) => {
      toast({
        title: "Topic Analysis Complete!",
        description: `Score: ${data.score}/100 - ${data.recommendation}`,
      });
    }
  });

  const viralContentMutation = useMutation({
    mutationFn: async ({ platform, trend }: { platform: string; trend: TrendData }) => {
      return await apiRequest('POST', '/api/trends/viral-content', { platform, trend });
    },
    onSuccess: (data) => {
      toast({
        title: "Viral Content Generated!",
        description: `Created content with ${data.viral_potential}% viral potential`,
      });
    }
  });

  const getTrendIcon = (growth: string) => {
    switch (growth) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEngagementColor = (potential: string) => {
    switch (potential) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const checkTopicTrend = () => {
    if (!topicToCheck.trim()) return;
    topicScoreMutation.mutate({ topic: topicToCheck, platform: selectedPlatform });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-primary" />
          Social Media Trend Predictor
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Discover what's trending and predict viral content opportunities across social media platforms
        </p>
      </div>

      {/* Filter Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Trend Analysis Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="general">All Platforms</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="industry">Industry (Optional)</Label>
              <Input
                id="industry"
                placeholder="e.g., Technology, Fashion, Food"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="audience">Target Audience (Optional)</Label>
              <Input
                id="audience"
                placeholder="e.g., Gen Z, Millennials, Business"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={() => refetch()} className="w-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Analyze Current Trends
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing trends...</p>
          </div>
        </div>
      ) : trends ? (
        <Tabs defaultValue="trending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trending">Trending Topics</TabsTrigger>
            <TabsTrigger value="formats">Viral Formats</TabsTrigger>
            <TabsTrigger value="hashtags">Hot Hashtags</TabsTrigger>
            <TabsTrigger value="insights">Content Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-4">
            <div className="grid gap-4">
              {trends.trending_topics.map((trend, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{trend.topic}</h3>
                          {getTrendIcon(trend.growth)}
                          <Badge variant="secondary">{trend.category}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {trend.timeframe}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {trend.platforms.join(', ')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{trend.confidence}%</div>
                        <div className="text-sm text-gray-500">Confidence</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Engagement Potential</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-3 h-3 rounded-full ${getEngagementColor(trend.engagement_potential)}`}></div>
                          <span className="capitalize text-sm">{trend.engagement_potential}</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Trending Hashtags</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {trend.hashtags.slice(0, 5).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => viralContentMutation.mutate({ platform: selectedPlatform, trend })}
                        disabled={viralContentMutation.isPending}
                        className="w-full"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Generate Viral Content
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="formats" className="space-y-4">
            <div className="grid gap-4">
              {trends.viral_content_formats.map((format, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold capitalize">{format.format}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{format.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{format.success_rate}%</div>
                        <div className="text-sm text-gray-500">Success Rate</div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Best Platforms</Label>
                      <div className="flex gap-2 mt-1">
                        {format.best_platforms.map((platform, i) => (
                          <Badge key={i} variant="secondary" className="capitalize">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hashtags" className="space-y-4">
            <div className="grid gap-4">
              {trends.recommended_hashtags.map((hashtag, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Hash className="w-5 h-5 text-primary" />
                        <div>
                          <h3 className="font-semibold">#{hashtag.tag}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{hashtag.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {getTrendIcon(hashtag.usage_trend)}
                          <span className="text-sm capitalize">{hashtag.usage_trend}</span>
                        </div>
                        <Progress value={hashtag.reach_potential} className="w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Optimal Posting Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {trends.content_insights.optimal_posting_times.map((time, index) => (
                      <Badge key={index} variant="outline">{time}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Trending Themes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {trends.content_insights.trending_themes.map((theme, index) => (
                      <Badge key={index} variant="secondary" className="capitalize">{theme}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Audience Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {trends.content_insights.audience_preferences.map((pref, index) => (
                      <Badge key={index} variant="outline" className="capitalize">{pref}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Seasonal Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {trends.content_insights.seasonal_trends.map((trend, index) => (
                      <Badge key={index} variant="secondary" className="capitalize">{trend}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>AI Prediction Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {trends.prediction_summary}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : null}

      {/* Topic Trend Checker */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Check Topic Trend Score
          </CardTitle>
          <CardDescription>
            Analyze any specific topic to see its trending potential
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter topic to analyze..."
              value={topicToCheck}
              onChange={(e) => setTopicToCheck(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkTopicTrend()}
            />
            <Button 
              onClick={checkTopicTrend}
              disabled={topicScoreMutation.isPending || !topicToCheck.trim()}
            >
              {topicScoreMutation.isPending ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <BarChart3 className="w-4 h-4" />
              )}
              Analyze
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}