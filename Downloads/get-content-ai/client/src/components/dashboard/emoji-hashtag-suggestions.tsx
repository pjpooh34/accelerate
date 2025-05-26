import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Hash, TrendingUp, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type Platform = "instagram" | "twitter" | "facebook" | "linkedin";

interface EmojiSuggestion {
  emoji: string;
  description: string;
  relevance_score: number;
}

interface HashtagSuggestion {
  hashtag: string;
  category: string;
  popularity: 'trending' | 'high' | 'medium' | 'niche';
  reach_potential: number;
}

interface PlatformOptimization {
  platform: Platform;
  recommended_emoji_count: number;
  recommended_hashtag_count: number;
  optimal_placement: string;
}

interface EmojiHashtagSuggestions {
  emojis: EmojiSuggestion[];
  hashtags: HashtagSuggestion[];
  platform_specific: PlatformOptimization[];
}

interface EmojiHashtagSuggestionsProps {
  content: string;
  platform: Platform;
  onApplyEmojis: (emojis: string[]) => void;
  onApplyHashtags: (hashtags: string[]) => void;
}

export default function EmojiHashtagSuggestions({ 
  content, 
  platform, 
  onApplyEmojis, 
  onApplyHashtags 
}: EmojiHashtagSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<EmojiHashtagSuggestions | null>(null);
  const [trendingHashtags, setTrendingHashtags] = useState<HashtagSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const generateSuggestions = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter some content first to get suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/suggestions/emoji-hashtag", {
        content,
        platform,
        languageModel: "openai"
      });
      
      const data = await response.json();
      setSuggestions(data);
      
      toast({
        title: "Suggestions Generated",
        description: "AI-powered emoji and hashtag suggestions are ready!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendingHashtags = async () => {
    setIsTrendingLoading(true);
    try {
      const response = await apiRequest("POST", "/api/suggestions/trending-hashtags", {
        platform,
        languageModel: "openai"
      });
      
      const data = await response.json();
      setTrendingHashtags(data.trending_hashtags || []);
      
      toast({
        title: "Trending Hashtags Updated",
        description: "Latest trending hashtags loaded!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load trending hashtags.",
        variant: "destructive",
      });
    } finally {
      setIsTrendingLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'emoji' | 'hashtag') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(prev).add(text));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(text);
          return newSet;
        });
      }, 2000);
      
      toast({
        title: "Copied!",
        description: `${type === 'emoji' ? 'Emoji' : 'Hashtag'} copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const applySelectedEmojis = (emojis: string[]) => {
    onApplyEmojis(emojis);
    toast({
      title: "Emojis Applied",
      description: `Added ${emojis.length} emojis to your content.`,
    });
  };

  const applySelectedHashtags = (hashtags: string[]) => {
    onApplyHashtags(hashtags);
    toast({
      title: "Hashtags Applied",
      description: `Added ${hashtags.length} hashtags to your content.`,
    });
  };

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case 'trending': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'niche': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
          AI Emoji & Hashtag Suggestions
        </CardTitle>
        <CardDescription>
          Get AI-powered emoji and hashtag recommendations optimized for {platform}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={generateSuggestions} 
              disabled={isLoading || !content.trim()}
              className="flex-1"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isLoading ? "Generating..." : "Generate Suggestions"}
            </Button>
            <Button 
              variant="outline" 
              onClick={getTrendingHashtags}
              disabled={isTrendingLoading}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {isTrendingLoading ? "Loading..." : "Trending"}
            </Button>
          </div>

          {suggestions && (
            <Tabs defaultValue="emojis" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="emojis">Emojis ({suggestions.emojis.length})</TabsTrigger>
                <TabsTrigger value="hashtags">Hashtags ({suggestions.hashtags.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="emojis" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Recommended Emojis</h3>
                  <Button
                    size="sm"
                    onClick={() => applySelectedEmojis(suggestions.emojis.slice(0, 3).map(e => e.emoji))}
                  >
                    Apply Top 3
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {suggestions.emojis.map((emoji, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{emoji.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {emoji.description}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {emoji.relevance_score}%
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(emoji.emoji, 'emoji')}
                      >
                        {copiedItems.has(emoji.emoji) ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="hashtags" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Recommended Hashtags</h3>
                  <Button
                    size="sm"
                    onClick={() => applySelectedHashtags(suggestions.hashtags.slice(0, 5).map(h => h.hashtag))}
                  >
                    Apply Top 5
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {suggestions.hashtags.map((hashtag, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <Hash className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="font-medium truncate">{hashtag.hashtag}</span>
                        <div className="flex space-x-1 flex-shrink-0">
                          <Badge className={`text-xs text-white ${getPopularityColor(hashtag.popularity)}`}>
                            {hashtag.popularity}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {hashtag.reach_potential}%
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(hashtag.hashtag, 'hashtag')}
                      >
                        {copiedItems.has(hashtag.hashtag) ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {trendingHashtags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-1 text-red-500" />
                Trending Now on {platform}
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingHashtags.slice(0, 8).map((hashtag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => copyToClipboard(hashtag.hashtag, 'hashtag')}
                  >
                    {hashtag.hashtag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {suggestions?.platform_specific[0] && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                {platform} Optimization Tips
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                • Use {suggestions.platform_specific[0].recommended_emoji_count} emojis
                • Include {suggestions.platform_specific[0].recommended_hashtag_count} hashtags
                • Place them {suggestions.platform_specific[0].optimal_placement}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}