import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Platform, ContentType } from "@/lib/types";
import { Image, FileText, Zap, MessageSquare, Video, BookOpen } from "lucide-react";

interface ContentTypeSelectorProps {
  platform: Platform;
  selectedType: ContentType;
  onChange: (type: ContentType) => void;
}

// Platform-specific content types with their most popular formats
const platformContentTypes = {
  instagram: [
    { id: "post" as ContentType, label: "Photo Post", icon: <Image className="w-4 h-4" />, description: "Single photo with caption" },
    { id: "carousel" as ContentType, label: "Carousel", icon: <Image className="w-4 h-4" />, description: "Multiple photos/slides" },
    { id: "story" as ContentType, label: "Story", icon: <Zap className="w-4 h-4" />, description: "24-hour content" },
    { id: "reel" as ContentType, label: "Reel", icon: <Video className="w-4 h-4" />, description: "Short video content" }
  ],
  twitter: [
    { id: "post" as ContentType, label: "Post", icon: <MessageSquare className="w-4 h-4" />, description: "Standard tweet" },
    { id: "thread" as ContentType, label: "Thread", icon: <MessageSquare className="w-4 h-4" />, description: "Multiple connected posts" },
    { id: "post" as ContentType, label: "Quote Tweet", icon: <MessageSquare className="w-4 h-4" />, description: "Retweet with comment" }
  ],
  facebook: [
    { id: "post" as ContentType, label: "Post", icon: <FileText className="w-4 h-4" />, description: "Text or image post" },
    { id: "story" as ContentType, label: "Story", icon: <Zap className="w-4 h-4" />, description: "24-hour content" },
    { id: "reel" as ContentType, label: "Reel", icon: <Video className="w-4 h-4" />, description: "Short video content" },
    { id: "article" as ContentType, label: "Article", icon: <BookOpen className="w-4 h-4" />, description: "Long-form content" }
  ],
  linkedin: [
    { id: "post" as ContentType, label: "Post", icon: <FileText className="w-4 h-4" />, description: "Professional update" },
    { id: "article" as ContentType, label: "Article", icon: <BookOpen className="w-4 h-4" />, description: "Long-form professional content" },
    { id: "carousel" as ContentType, label: "Carousel", icon: <Image className="w-4 h-4" />, description: "Document or image slides" }
  ]
};

export default function ContentTypeSelector({ platform, selectedType, onChange }: ContentTypeSelectorProps) {
  const contentTypes = platformContentTypes[platform] || platformContentTypes.instagram;

  return (
    <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-5 shadow-sm">
      <h4 className="text-base font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
        Content Type for {platform === 'twitter' ? 'X (Twitter)' : platform.charAt(0).toUpperCase() + platform.slice(1)}
      </h4>
      <RadioGroup 
        value={selectedType} 
        onValueChange={onChange}
        className="space-y-3"
      >
        {contentTypes.map((type) => (
          <div key={type.id} className="flex items-center space-x-3 p-3 hover:bg-primary/5 rounded-lg transition-colors border border-slate-200/50 dark:border-slate-700/50">
            <RadioGroupItem value={type.id} id={type.id} className="text-primary" />
            <div className="flex items-center space-x-2 flex-1">
              <div className="text-primary">{type.icon}</div>
              <div className="flex-1">
                <Label htmlFor={type.id} className="text-sm font-medium cursor-pointer block">
                  {type.label}
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">{type.description}</p>
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}