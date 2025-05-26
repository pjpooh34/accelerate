import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { SiX, SiFacebook, SiInstagram, SiLinkedin } from "react-icons/si";

interface SocialShareButtonsProps {
  content: string;
  platform?: string;
}

export default function SocialShareButtons({ content, platform }: SocialShareButtonsProps) {
  const encodedContent = encodeURIComponent(content);
  
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedContent}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodedContent}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodedContent}`,
    instagram: `https://www.instagram.com/` // Instagram doesn't support direct posting via URL, but we can still link to it
  };

  const platforms = [
    {
      name: "Twitter",
      icon: SiX,
      url: shareUrls.twitter,
      color: "text-blue-400 hover:text-blue-500",
      bgColor: "hover:bg-blue-50 dark:hover:bg-blue-900/20"
    },
    {
      name: "Facebook", 
      icon: SiFacebook,
      url: shareUrls.facebook,
      color: "text-blue-600 hover:text-blue-700",
      bgColor: "hover:bg-blue-50 dark:hover:bg-blue-900/20"
    },
    {
      name: "LinkedIn",
      icon: SiLinkedin,
      url: shareUrls.linkedin,
      color: "text-blue-700 hover:text-blue-800",
      bgColor: "hover:bg-blue-50 dark:hover:bg-blue-900/20"
    },
    {
      name: "Instagram",
      icon: SiInstagram,
      url: shareUrls.instagram,
      color: "text-pink-500 hover:text-pink-600",
      bgColor: "hover:bg-pink-50 dark:hover:bg-pink-900/20",
      note: "Copy content and paste on Instagram"
    }
  ];

  // If a specific platform is selected, show only that platform
  const displayPlatforms = platform 
    ? platforms.filter(p => p.name.toLowerCase() === platform.toLowerCase())
    : platforms;

  const handleShare = (url: string, platformName: string) => {
    if (platformName === "Instagram") {
      // Copy content to clipboard for Instagram
      navigator.clipboard.writeText(content);
      // Open Instagram
      window.open(url, '_blank');
      return;
    }
    
    // Open share window for other platforms
    window.open(url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Share to Social Media
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {displayPlatforms.map((socialPlatform) => {
          const Icon = socialPlatform.icon;
          return (
            <Button
              key={socialPlatform.name}
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 ${socialPlatform.bgColor} border-gray-200 dark:border-gray-700`}
              onClick={() => handleShare(socialPlatform.url, socialPlatform.name)}
            >
              <Icon className={`w-4 h-4 ${socialPlatform.color}`} />
              <span className="text-sm">
                {socialPlatform.name}
              </span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </Button>
          );
        })}
      </div>
      
      {/* Instagram note */}
      {(!platform || platform.toLowerCase() === 'instagram') && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 For Instagram: Content will be copied to clipboard - paste it in the Instagram app
        </p>
      )}
      
      {/* Platform-specific tips */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>• Twitter: Opens composer with your content pre-filled</p>
        <p>• Facebook: Opens share dialog with your content</p>
        <p>• LinkedIn: Opens share window for professional posting</p>
      </div>
    </div>
  );
}