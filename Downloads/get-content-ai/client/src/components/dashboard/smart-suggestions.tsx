import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Hash, Smile, Copy, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Platform } from "@/lib/types";

interface SmartSuggestionsProps {
  content: string;
  platform: Platform;
  onAddToContent: (addition: string) => void;
}

// Platform-specific emoji suggestions based on content analysis
const getEmojiSuggestions = (content: string, platform: Platform): string[] => {
  const text = content.toLowerCase();
  let suggestions: string[] = [];

  // Content-based emoji suggestions
  if (text.includes('success') || text.includes('achievement') || text.includes('win')) {
    suggestions.push('🎉', '🏆', '✨', '🚀', '💪');
  }
  if (text.includes('love') || text.includes('heart') || text.includes('passion')) {
    suggestions.push('❤️', '💖', '💕', '😍', '🥰');
  }
  if (text.includes('food') || text.includes('eat') || text.includes('delicious')) {
    suggestions.push('🍽️', '😋', '🔥', '👌', '🤤');
  }
  if (text.includes('travel') || text.includes('adventure') || text.includes('explore')) {
    suggestions.push('✈️', '🌍', '🗺️', '📸', '🌟');
  }
  if (text.includes('business') || text.includes('work') || text.includes('professional')) {
    suggestions.push('💼', '📈', '🎯', '💡', '⚡');
  }
  if (text.includes('tech') || text.includes('innovation') || text.includes('digital')) {
    suggestions.push('💻', '🚀', '⚡', '🔮', '🤖');
  }
  if (text.includes('fitness') || text.includes('health') || text.includes('workout')) {
    suggestions.push('💪', '🏃‍♂️', '🏋️‍♀️', '🔥', '💯');
  }

  // Platform-specific additions
  if (platform === 'instagram') {
    suggestions.push('📸', '✨', '🌟', '💫', '🦋');
  } else if (platform === 'linkedin') {
    suggestions.push('💼', '📊', '🎯', '💡', '🚀');
  } else if (platform === 'twitter') {
    suggestions.push('🧵', '💭', '🔥', '👀', '💯');
  } else if (platform === 'facebook') {
    suggestions.push('👥', '💬', '👍', '❤️', '🎉');
  }

  // Add general engaging emojis
  suggestions.push('💯', '🔥', '✨', '👏', '🙌');

  // Remove duplicates and limit to 12
  return Array.from(new Set(suggestions)).slice(0, 12);
};

// Platform-specific hashtag suggestions
const getHashtagSuggestions = (content: string, platform: Platform): string[] => {
  const text = content.toLowerCase();
  let suggestions: string[] = [];

  // Content-based hashtags
  if (text.includes('marketing') || text.includes('brand')) {
    suggestions.push('#Marketing', '#Branding', '#DigitalMarketing', '#SocialMedia');
  }
  if (text.includes('business') || text.includes('entrepreneur')) {
    suggestions.push('#Business', '#Entrepreneur', '#Startup', '#Growth', '#Success');
  }
  if (text.includes('tech') || text.includes('innovation')) {
    suggestions.push('#Technology', '#Innovation', '#AI', '#Digital', '#Future');
  }
  if (text.includes('health') || text.includes('fitness')) {
    suggestions.push('#Health', '#Fitness', '#Wellness', '#Lifestyle', '#Motivation');
  }
  if (text.includes('food') || text.includes('recipe')) {
    suggestions.push('#Food', '#Foodie', '#Recipe', '#Cooking', '#Delicious');
  }
  if (text.includes('travel') || text.includes('adventure')) {
    suggestions.push('#Travel', '#Adventure', '#Explore', '#Wanderlust', '#Photography');
  }
  if (text.includes('fashion') || text.includes('style')) {
    suggestions.push('#Fashion', '#Style', '#OOTD', '#Trendy', '#Beauty');
  }

  // Platform-specific hashtags
  if (platform === 'instagram') {
    suggestions.push('#InstagramTips', '#InstaGood', '#PhotoOfTheDay', '#Instagrams', '#InstaDaily');
  } else if (platform === 'linkedin') {
    suggestions.push('#LinkedIn', '#Professional', '#CareerTips', '#Networking', '#Leadership');
  } else if (platform === 'twitter') {
    suggestions.push('#TwitterTips', '#SocialMediaTips', '#OnlineMarketing', '#ContentCreator');
  } else if (platform === 'facebook') {
    suggestions.push('#FacebookMarketing', '#SocialEngagement', '#CommunityBuilding');
  }

  // Add trending and general hashtags
  suggestions.push('#ContentCreator', '#SocialMediaMarketing', '#OnlineBusiness', '#DigitalAge', '#Trending');

  // Remove duplicates and limit to 15
  return Array.from(new Set(suggestions)).slice(0, 15);
};

export default function SmartSuggestions({ content, platform, onAddToContent }: SmartSuggestionsProps) {
  const { toast } = useToast();
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

  const emojiSuggestions = getEmojiSuggestions(content, platform);
  const hashtagSuggestions = getHashtagSuggestions(content, platform);

  const handleEmojiClick = (emoji: string) => {
    if (selectedEmojis.includes(emoji)) {
      setSelectedEmojis(selectedEmojis.filter(e => e !== emoji));
    } else {
      setSelectedEmojis([...selectedEmojis, emoji]);
    }
  };

  const handleHashtagClick = (hashtag: string) => {
    if (selectedHashtags.includes(hashtag)) {
      setSelectedHashtags(selectedHashtags.filter(h => h !== hashtag));
    } else {
      setSelectedHashtags([...selectedHashtags, hashtag]);
    }
  };

  const addEmojisToContent = () => {
    if (selectedEmojis.length === 0) return;
    
    const emojisText = ` ${selectedEmojis.join(' ')}`;
    onAddToContent(emojisText);
    setSelectedEmojis([]);
    
    toast({
      title: "Emojis added!",
      description: `Added ${selectedEmojis.length} emojis to your content`,
    });
  };

  const addHashtagsToContent = () => {
    if (selectedHashtags.length === 0) return;
    
    const hashtagsText = `\n\n${selectedHashtags.join(' ')}`;
    onAddToContent(hashtagsText);
    setSelectedHashtags([]);
    
    toast({
      title: "Hashtags added!",
      description: `Added ${selectedHashtags.length} hashtags to your content`,
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Smart Suggestions for {platform.charAt(0).toUpperCase() + platform.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="emojis" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="emojis" className="flex items-center gap-2">
              <Smile className="w-4 h-4" />
              Emojis ({emojiSuggestions.length})
            </TabsTrigger>
            <TabsTrigger value="hashtags" className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Hashtags ({hashtagSuggestions.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="emojis" className="space-y-4">
            <div className="grid grid-cols-6 gap-2">
              {emojiSuggestions.map((emoji, index) => (
                <Button
                  key={index}
                  variant={selectedEmojis.includes(emoji) ? "default" : "outline"}
                  className="h-12 text-lg hover:scale-110 transition-transform"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
            
            {selectedEmojis.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">Selected:</span>
                  {selectedEmojis.map((emoji, index) => (
                    <Badge key={index} variant="secondary" className="text-lg px-2 py-1">
                      {emoji}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={addEmojisToContent} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add to Content
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => copyToClipboard(selectedEmojis.join(' '), 'Emojis')}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="hashtags" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {hashtagSuggestions.map((hashtag, index) => (
                <Button
                  key={index}
                  variant={selectedHashtags.includes(hashtag) ? "default" : "outline"}
                  className="justify-start text-sm"
                  onClick={() => handleHashtagClick(hashtag)}
                >
                  {hashtag}
                </Button>
              ))}
            </div>
            
            {selectedHashtags.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">Selected:</span>
                  {selectedHashtags.map((hashtag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {hashtag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={addHashtagsToContent} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add to Content
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => copyToClipboard(selectedHashtags.join(' '), 'Hashtags')}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                </div>
              </div>
            )}
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>💡 <strong>{platform === 'twitter' ? 'Twitter' : platform === 'instagram' ? 'Instagram' : platform === 'linkedin' ? 'LinkedIn' : 'Facebook'} Tips:</strong></p>
              {platform === 'instagram' && <p>• Use 5-10 hashtags for best reach</p>}
              {platform === 'twitter' && <p>• Use 1-2 hashtags to avoid looking spammy</p>}
              {platform === 'linkedin' && <p>• Use 3-5 professional hashtags</p>}
              {platform === 'facebook' && <p>• Use 1-2 hashtags as they have less impact</p>}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}