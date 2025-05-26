import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/auth-context";
import SEO from "@/components/layout/seo";

import ContentForm, { ContentFormValues, ExtendedFormValues } from "@/components/dashboard/content-form";
import PlatformSelector from "@/components/dashboard/platform-selector";
import ContentPreview from "@/components/dashboard/content-preview";
import ContentVariations from "@/components/dashboard/content-variations";
import ContentHistoryComponent from "@/components/dashboard/content-history";
import SocialShareButtons from "@/components/dashboard/social-share-buttons";

import { 
  Platform, 
  ContentType, 
  ContentResponse, 
  ContentVariation,
  ContentHistory
} from "@/lib/types";

export default function Dashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [contentType, setContentType] = useState<ContentType>("postWithImage");
  const [currentContent, setCurrentContent] = useState<ContentResponse | null>(null);
  const [variations, setVariations] = useState<ContentVariation[]>([]);
  const [history, setHistory] = useState<ContentHistory[]>([]);
  const [lastUsedOptions, setLastUsedOptions] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  
  // Fetch user content history if logged in
  const { data: userHistory, isLoading: isLoadingHistory, refetch } = useQuery({
    queryKey: ['userContent', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const response = await fetch('/api/user/content', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch content history');
        }
        
        const data = await response.json();
        return data.map((item: any) => ({
          id: item.id.toString(),
          title: item.title,
          platform: item.platform,
          createdAt: new Date(item.createdAt).toISOString()
        }));
      } catch (error) {
        console.error('Error fetching user content:', error);
        return [];
      }
    },
    enabled: !!user
  });
  
  // Update history when user content is loaded
  useEffect(() => {
    if (userHistory && userHistory.length > 0) {
      setHistory(userHistory);
    }
  }, [userHistory]);

  // Generate content mutation
  const { 
    mutate: generateContent, 
    isPending: isGenerating 
  } = useMutation({
    mutationFn: async (formData: ExtendedFormValues) => {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          platform,
          contentType,
          advancedOptions: formData.advancedOptions
        }),
        credentials: "include"
      });
      
      if (!response.ok) {
        const error = await response.json();
        if (response.status === 429) {
          // Handle usage limit errors with helpful messages
          if (error.requiresSignup) {
            throw new Error("Guest limit reached! Create a free account to get 5 content generations.");
          } else if (error.requiresUpgrade) {
            throw new Error("Free plan limit reached (5/5 generations). Upgrade to Pro for unlimited content!");
          }
        }
        throw new Error(error.message || "Failed to generate content");
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setCurrentContent(data.mainContent);
      setVariations(data.variations || []);
      
      // Add to history
      const newHistoryItem: ContentHistory = {
        id: Date.now().toString(),
        title: data.mainContent.title,
        platform,
        createdAt: "just now",
      };
      
      setHistory([newHistoryItem, ...history.slice(0, 2)]);
      
      // Refresh user content history if logged in
      if (user) {
        setTimeout(() => {
          refetch();
        }, 500);
      }
      
      toast({
        title: "Content generated successfully",
        description: "Your content has been generated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error generating content",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  // Generate more variations mutation
  const { 
    mutate: generateMoreVariations, 
    isPending: isGeneratingMore 
  } = useMutation({
    mutationFn: async () => {
      if (!currentContent) throw new Error("No content to build upon");
      
      // Include the same advanced options currently being used
      const response = await fetch("/api/generate/more", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform,
          contentType,
          baseContent: currentContent,
          advancedOptions: lastUsedOptions || undefined
        }),
        credentials: "include"
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate more variations");
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setVariations([...variations, ...data.variations]);
      toast({
        title: "More variations generated",
        description: "Additional content variations are ready",
      });
    },
    onError: (error) => {
      toast({
        title: "Error generating variations",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleSelectVariation = (variation: ContentVariation) => {
    setCurrentContent({
      title: variation.title || (currentContent?.title || ""),
      content: variation.content,
    });
  };

  const handlePlatformChange = (newPlatform: Platform) => {
    setPlatform(newPlatform);
  };

  const handleSubmit = (values: ExtendedFormValues) => {
    // Store the advanced options for future use
    setLastUsedOptions(values.advancedOptions);
    generateContent(values);
  };

  const handleGenerateMore = () => {
    generateMoreVariations();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SEO 
        title="Dashboard | Get Content AI"
        description="Create AI-powered content for your social media platforms. Generate engaging posts, manage your content history, and customize your content strategy."
        keywords="content dashboard, social media generator, AI writing assistant, content management"
      />
      {/* Post Bridge Advertisement */}
      <div className="mb-6">
        <div 
          onClick={() => window.open('https://post-bridge.com?atp=BkPpVi', '_blank')}
          className="glass-card p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                PB
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  🚀 Try Post Bridge - Auto-Schedule Your Content!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Automatically schedule and post your AI-generated content across all platforms
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
              <span className="text-sm font-medium">Learn More</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="mb-8 border-b border-primary/10 dark:border-primary/20 pb-1">
        <div className="flex space-x-8">
          <button className="px-5 py-3 rounded-t-md bg-gradient-to-r from-primary to-secondary text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:translate-y-[-2px] active:translate-y-0">
            Create Content
          </button>
          <button className="px-5 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-all border-b-2 border-transparent hover:border-primary/30">
            My Content
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none"></div>
            <h3 className="text-lg font-semibold mb-5 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Choose Platform</h3>
            <PlatformSelector 
              selectedPlatform={platform} 
              onPlatformChange={handlePlatformChange} 
            />
          </div>
          
          <div className="glass-card overflow-hidden">
            <div className="p-5 flex items-center border-b border-slate-200 dark:border-slate-700/50">
              <div className="h-8 w-1 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Content Generator</h3>
            </div>
            <div className="p-5">
              <ContentForm 
                onSubmit={handleSubmit} 
                isSubmitting={isGenerating}
                contentType={contentType}
                setContentType={setContentType}
              />
            </div>
          </div>
        </div>
        
        {/* Right Column - Content Workspace */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card overflow-hidden">
            <div className="p-5 flex items-center border-b border-slate-200 dark:border-slate-700/50">
              <div className="h-8 w-1 bg-gradient-to-b from-accent to-primary rounded-full mr-3"></div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Content Preview</h3>
            </div>
            <div className="p-6">
              <ContentPreview 
                content={currentContent} 
                platform={platform}
                loading={isGenerating}
                onContentUpdate={setCurrentContent}
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
              />
            </div>
          </div>
          
          <div className="glass-card overflow-hidden">
            <div className="p-5 flex items-center border-b border-slate-200 dark:border-slate-700/50">
              <div className="h-8 w-1 bg-gradient-to-b from-secondary to-primary rounded-full mr-3"></div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Content Variations</h3>
            </div>
            <div className="p-6">
              <ContentVariations 
                variations={variations} 
                loading={isGenerating} 
                onSelectVariation={handleSelectVariation}
                onGenerateMore={handleGenerateMore}
                isGeneratingMore={isGeneratingMore}
              />
            </div>
          </div>
          
          <div className="glass-card overflow-hidden">
            <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-700/50">
              <div className="flex items-center">
                <div className="h-8 w-1 bg-gradient-to-b from-primary to-accent rounded-full mr-3"></div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Content History</h3>
              </div>
              {!user && (
                <a href="/login" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  Log in to save history
                </a>
              )}
            </div>
            <div className="p-5">
              <ContentHistoryComponent 
                historyItems={history}
                loading={isLoadingHistory} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
