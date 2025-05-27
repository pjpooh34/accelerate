import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Zap, 
  Eye, 
  Heart, 
  Share2, 
  MessageCircle,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Hash
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface PerformancePrediction {
  overallScore: number;
  viralPotential: number;
  engagementScore: number;
  reachPotential: number;
  platformOptimization: {
    instagram: number;
    twitter: number;
    facebook: number;
    linkedin: number;
  };
  insights: {
    strengths: string[];
    improvements: string[];
    audience_appeal: string;
    timing_suggestion: string;
    hashtag_effectiveness: number;
  };
  predicted_metrics: {
    likes: { min: number; max: number };
    shares: { min: number; max: number };
    comments: { min: number; max: number };
    reach: { min: number; max: number };
  };
  confidence_level: number;
  analysis_summary: string;
}

export default function PerformancePage() {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [contentType, setContentType] = useState('post');
  const [targetAudience, setTargetAudience] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [industry, setIndustry] = useState('');
  const [prediction, setPrediction] = useState<PerformancePrediction | null>(null);
  const { toast } = useToast();

  const predictMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/performance/predict', data);
    },
    onSuccess: (data) => {
      setPrediction(data);
      toast({
        title: "Analysis Complete!",
        description: "Your content performance prediction is ready.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze content performance",
        variant: "destructive",
      });
    }
  });

  const handlePredict = () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter content to analyze",
        variant: "destructive",
      });
      return;
    }

    predictMutation.mutate({
      content,
      platform,
      contentType,
      targetAudience: targetAudience || undefined,
      hashtags: hashtags ? hashtags.split(',').map(h => h.trim()) : undefined,
      industry: industry || undefined
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'Excellent', variant: 'default' as const };
    if (score >= 60) return { label: 'Good', variant: 'secondary' as const };
    return { label: 'Needs Work', variant: 'destructive' as const };
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-primary" />
          AI Content Performance Predictor
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Analyze your content and predict its performance across social media platforms using advanced AI
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Content Analysis
              </CardTitle>
              <CardDescription>
                Enter your content and platform details for AI-powered performance prediction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter your social media content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">Post</SelectItem>
                      <SelectItem value="story">Story</SelectItem>
                      <SelectItem value="reel">Reel/Video</SelectItem>
                      <SelectItem value="carousel">Carousel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="audience">Target Audience (Optional)</Label>
                <Input
                  id="audience"
                  placeholder="e.g., young professionals, fitness enthusiasts"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="hashtags">Hashtags (Optional)</Label>
                <Input
                  id="hashtags"
                  placeholder="e.g., #socialmedia, #marketing, #ai"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry (Optional)</Label>
                <Input
                  id="industry"
                  placeholder="e.g., technology, fitness, food"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>

              <Button 
                onClick={handlePredict}
                disabled={predictMutation.isPending}
                className="w-full"
                size="lg"
              >
                {predictMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Analyzing Content...
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Predict Performance
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {prediction ? (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        Performance Score
                      </span>
                      <Badge {...getScoreBadge(prediction.overallScore)}>
                        {getScoreBadge(prediction.overallScore).label}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getScoreColor(prediction.overallScore)}`}>
                        {prediction.overallScore}/100
                      </div>
                      <p className="text-gray-600 mt-2">{prediction.analysis_summary}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Viral Potential</span>
                          <span className="text-sm font-bold">{prediction.viralPotential}%</span>
                        </div>
                        <Progress value={prediction.viralPotential} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Engagement</span>
                          <span className="text-sm font-bold">{prediction.engagementScore}%</span>
                        </div>
                        <Progress value={prediction.engagementScore} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Reach Potential</span>
                          <span className="text-sm font-bold">{prediction.reachPotential}%</span>
                        </div>
                        <Progress value={prediction.reachPotential} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Confidence</span>
                          <span className="text-sm font-bold">{prediction.confidence_level}%</span>
                        </div>
                        <Progress value={prediction.confidence_level} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Platform Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(prediction.platformOptimization).map(([platform, score]) => (
                      <div key={platform}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium capitalize">{platform}</span>
                          <span className="text-sm font-bold">{score}%</span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="metrics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Predicted Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="font-medium">Likes</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {prediction.predicted_metrics.likes.min} - {prediction.predicted_metrics.likes.max}
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Share2 className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">Shares</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {prediction.predicted_metrics.shares.min} - {prediction.predicted_metrics.shares.max}
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageCircle className="w-4 h-4 text-green-500" />
                          <span className="font-medium">Comments</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {prediction.predicted_metrics.comments.min} - {prediction.predicted_metrics.comments.max}
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="w-4 h-4 text-purple-500" />
                          <span className="font-medium">Reach</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {prediction.predicted_metrics.reach.min} - {prediction.predicted_metrics.reach.max}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {prediction.insights.strengths.map((strength, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      Improvement Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {prediction.insights.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Timing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{prediction.insights.timing_suggestion}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Hash className="w-5 h-5" />
                        Hashtag Effectiveness
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Progress value={prediction.insights.hashtag_effectiveness} className="flex-1" />
                        <span className="text-sm font-bold">{prediction.insights.hashtag_effectiveness}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Audience Appeal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{prediction.insights.audience_appeal}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-full flex items-center justify-center p-12">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Ready to Analyze</h3>
                <p>Enter your content and click "Predict Performance" to see AI-powered insights</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}