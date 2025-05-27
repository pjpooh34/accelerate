import { useState } from "react";
import { Platform, SocialPlatform } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SiInstagram, SiFacebook, SiLinkedin, SiX } from "react-icons/si";

interface PlatformSelectorProps {
  selectedPlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
}

export default function PlatformSelector({ selectedPlatform, onPlatformChange }: PlatformSelectorProps) {
  const platforms: { id: Platform; name: string; icon: React.ReactNode }[] = [
    { 
      id: "instagram", 
      name: "Instagram", 
      icon: <SiInstagram className="platform-icon w-7 h-7" /> 
    },
    { 
      id: "twitter", 
      name: "X (Twitter)", 
      icon: <SiX className="platform-icon w-7 h-7" /> 
    },
    { 
      id: "facebook", 
      name: "Facebook", 
      icon: <SiFacebook className="platform-icon w-7 h-7" /> 
    },
    { 
      id: "linkedin", 
      name: "LinkedIn", 
      icon: <SiLinkedin className="platform-icon w-7 h-7" /> 
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className={`platform-item cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl glass btn-transition
              ${selectedPlatform === platform.id 
                ? "bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 shadow-md platform-active" 
                : "hover:bg-primary/5"
              }`}
            onClick={() => onPlatformChange(platform.id)}
          >
            <div className={`w-12 h-12 flex items-center justify-center mb-2 p-2 rounded-full 
              ${selectedPlatform === platform.id 
                ? "bg-white/80 dark:bg-slate-800/80 shadow-inner" 
                : "bg-white/40 dark:bg-slate-800/40"
              }`}>
              {platform.icon}
            </div>
            <span className={`text-sm font-medium
              ${selectedPlatform === platform.id 
                ? "text-primary dark:text-primary" 
                : "text-slate-600 dark:text-slate-300"
              }`}>
              {platform.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
