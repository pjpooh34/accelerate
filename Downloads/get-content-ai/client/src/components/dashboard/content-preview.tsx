import { Platform, ContentResponse } from "@/lib/types";
import { Copy, Download, Share2, Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ExportDialog from "./export-dialog";
import ScheduleDialog from "./schedule-dialog";
import SocialShareButtons from "./social-share-buttons";
import SmartSuggestions from "./smart-suggestions";
import ImageUpload from "./image-upload";
import { useState } from "react";
import { Content } from "@shared/schema";

interface ContentPreviewProps {
  content: ContentResponse | null;
  platform: Platform;
  loading: boolean;
  onContentUpdate?: (updatedContent: ContentResponse) => void;
  selectedImage?: string;
  onImageSelect?: (imageUrl: string) => void;
}

export default function ContentPreview({ content, platform, loading, onContentUpdate, selectedImage, onImageSelect }: ContentPreviewProps) {
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  // Convert ContentResponse to Content type for export/schedule dialogs
  const contentForExport = content ? {
    id: 0, // Will be set by backend when saved
    title: content.title,
    content: content.content,
    platform,
    contentType: "postWithImage", // Default type, should be passed from parent
    createdAt: new Date(),
    userId: null,
    category: null
  } : null;

  const handleCopy = () => {
    if (!content) return;
    
    navigator.clipboard.writeText(content.content);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard",
    });
  };
  
  const handleSave = () => {
    if (!content) return;
    
    // In a real implementation, we would call an API endpoint to save
    // For now, we'll just toggle the state for UI feedback
    setIsSaved(!isSaved);
    
    toast({
      title: isSaved ? "Removed from favorites" : "Saved to favorites",
      description: isSaved 
        ? "Content has been removed from your favorites" 
        : "Content has been saved to your favorites",
    });
  };

  const handleAddToContent = (addition: string) => {
    if (!content || !onContentUpdate) return;
    
    const updatedContent = {
      ...content,
      content: content.content + addition
    };
    
    onContentUpdate(updatedContent);
    
    toast({
      title: "Content updated!",
      description: "Smart suggestions added to your content",
    });
  };

  const getProfileInitials = () => {
    return "YB";
  };

  const getPlatformSpecificUI = () => {
    if (!content) return null;

    switch (platform) {
      case "instagram":
        return (
          <div className="mx-auto max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Post Header */}
            <div className="p-3 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                {getProfileInitials()}
              </div>
              <div>
                <p className="text-sm font-semibold dark:text-white">yourbrand</p>
              </div>
              <div className="ml-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-400">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </div>
            </div>
            
            {/* Post Media */}
            <div className="w-full h-auto aspect-square bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
              {content.videoUrl ? (
                <video 
                  src={content.videoUrl} 
                  className="w-full h-full object-cover"
                  controls
                  muted
                  autoPlay
                  loop
                >
                  Your browser does not support the video tag.
                </video>
              ) : content.imageUrl ? (
                <img 
                  src={content.imageUrl} 
                  alt="Generated content" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              )}
            </div>
            
            {/* Post Actions */}
            <div className="p-3 flex items-center space-x-4">
              <button className="text-slate-800 dark:text-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </button>
              <button className="text-slate-800 dark:text-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
              <button className="text-slate-800 dark:text-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
              <button className="text-slate-800 dark:text-slate-200 ml-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            </div>
            
            {/* Post Content */}
            <div className="px-3 pb-3">
              <p className="text-sm mb-1 dark:text-white"><span className="font-semibold">yourbrand</span> {content.title}</p>
              <p className="text-sm mb-2 whitespace-pre-line dark:text-slate-300">
                {content.content}
              </p>
              <p className="text-xs text-slate-500">Posted now</p>
            </div>
          </div>
        );
        
      case "linkedin":
        return (
          <div className="mx-auto max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Post Header */}
            <div className="p-3 flex items-center space-x-3">
              <div className="w-10 h-10 rounded bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white text-xs font-bold">
                {getProfileInitials()}
              </div>
              <div>
                <p className="text-sm font-semibold dark:text-white">Your Brand</p>
                <p className="text-xs text-slate-500">Company • 1,234 followers</p>
                <p className="text-xs text-slate-500">Just now • <span className="text-slate-400">🌎</span></p>
              </div>
              <div className="ml-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-400">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </div>
            </div>
            
            {/* Post Content */}
            <div className="px-3 py-2">
              <h3 className="font-bold text-base mb-2 dark:text-white">{content.title}</h3>
              <p className="text-sm mb-3 whitespace-pre-line dark:text-slate-300">
                {content.content}
              </p>
            </div>
            
            {/* Post Image */}
            <div className="w-full h-auto aspect-video bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
            
            {/* Post Stats */}
            <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center">
                <div className="flex -space-x-1">
                  <div className="w-4 h-4 rounded-full bg-blue-500 border border-white dark:border-slate-800"></div>
                  <div className="w-4 h-4 rounded-full bg-red-500 border border-white dark:border-slate-800"></div>
                  <div className="w-4 h-4 rounded-full bg-green-500 border border-white dark:border-slate-800"></div>
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400 ml-1">42</span>
                <span className="text-xs text-slate-600 dark:text-slate-400 ml-auto">8 comments</span>
              </div>
            </div>
            
            {/* Post Actions */}
            <div className="p-2 flex items-center justify-between">
              <button className="flex items-center justify-center space-x-1 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-400">
                  <path d="M7 10v12" />
                  <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                </svg>
                <span className="text-xs text-slate-600 dark:text-slate-400">Like</span>
              </button>
              <button className="flex items-center justify-center space-x-1 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-400">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="text-xs text-slate-600 dark:text-slate-400">Comment</span>
              </button>
              <button className="flex items-center justify-center space-x-1 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-400">
                  <path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5Z" />
                  <path d="m4.5 11.5 4 4" />
                  <path d="m20 6-5.5 5.5" />
                  <path d="m14.5 11.5 5.5 5.5" />
                </svg>
                <span className="text-xs text-slate-600 dark:text-slate-400">Repost</span>
              </button>
              <button className="flex items-center justify-center space-x-1 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-400">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                </svg>
                <span className="text-xs text-slate-600 dark:text-slate-400">Send</span>
              </button>
            </div>
          </div>
        );
        
      case "twitter":
        return (
          <div className="mx-auto max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Post Header */}
            <div className="p-3 flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {getProfileInitials()}
              </div>
              <div>
                <div className="flex items-center">
                  <p className="text-sm font-semibold dark:text-white">Your Brand</p>
                  <p className="text-sm text-slate-500 ml-1">@yourbrand</p>
                  <p className="text-sm text-slate-500 ml-1">· Just now</p>
                </div>
                
                {/* Post Content */}
                <div className="mt-1">
                  <p className="text-sm whitespace-pre-line dark:text-slate-200 mb-2">
                    {content.content}
                  </p>
                </div>
                
                {/* Image if needed */}
                <div className="mt-2 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <div className="w-full h-auto aspect-video bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                  </div>
                </div>
                
                {/* Post Actions */}
                <div className="mt-3 flex items-center justify-between pr-8">
                  <button className="flex items-center group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-blue-500">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="text-xs text-slate-500 ml-2">24</span>
                  </button>
                  
                  <button className="flex items-center group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-green-500">
                      <path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5Z" />
                      <path d="m4.5 11.5 4 4" />
                      <path d="m20 6-5.5 5.5" />
                      <path d="m14.5 11.5 5.5 5.5" />
                    </svg>
                    <span className="text-xs text-slate-500 ml-2">8</span>
                  </button>
                  
                  <button className="flex items-center group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-red-500">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    <span className="text-xs text-slate-500 ml-2">47</span>
                  </button>
                  
                  <button className="flex items-center group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-blue-500">
                      <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4" />
                      <path d="M17 8l-5-5-5 5" />
                      <path d="M12 3v12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case "facebook":
        return (
          <div className="mx-auto max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Post Header */}
            <div className="p-3 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
                {getProfileInitials()}
              </div>
              <div>
                <p className="text-sm font-semibold dark:text-white">Your Brand</p>
                <p className="text-xs text-slate-500">Just now · <span className="text-slate-400">🌎</span></p>
              </div>
              <div className="ml-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-400">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </div>
            </div>
            
            {/* Post Content */}
            <div className="px-3 py-2">
              <h3 className="font-bold text-base mb-2 dark:text-white">{content.title}</h3>
              <p className="text-sm mb-3 whitespace-pre-line dark:text-slate-300">
                {content.content}
              </p>
            </div>
            
            {/* Post Image */}
            <div className="w-full h-auto aspect-video bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
            
            {/* Post Stats */}
            <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="flex -space-x-1 mr-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 border border-white dark:border-slate-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"></path>
                      </svg>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-red-500 border border-white dark:border-slate-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                      </svg>
                    </div>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">86</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">12 comments · 3 shares</div>
              </div>
            </div>
            
            {/* Post Actions */}
            <div className="p-1 flex items-center justify-between">
              <button className="flex-1 flex items-center justify-center space-x-1 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-400">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"></path>
                </svg>
                <span className="text-xs text-slate-600 dark:text-slate-400">Like</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-1 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-400">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="text-xs text-slate-600 dark:text-slate-400">Comment</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-1 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-400">
                  <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4" />
                  <path d="M17 8l-5-5-5 5" />
                  <path d="M12 3v12" />
                </svg>
                <span className="text-xs text-slate-600 dark:text-slate-400">Share</span>
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="mx-auto max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="font-bold text-lg mb-2 dark:text-white">{content.title}</h3>
            <p className="text-sm whitespace-pre-line dark:text-slate-300">{content.content}</p>
          </div>
        );
    }
  };

  return (
    <div className="glass-card overflow-hidden shadow-lg">
      <div className="border-b border-primary/10 flex flex-row items-center justify-between px-6 py-4 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10">
        <h3 className="text-lg font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Preview</h3>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCopy}
            disabled={!content}
            className="text-slate-500 hover:text-primary btn-transition"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={!content}
            className="text-slate-500 hover:text-secondary btn-transition"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={!content}
            className="text-slate-500 hover:text-accent btn-transition"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-6 glass bg-white/30 dark:bg-slate-900/30 flex items-center justify-center min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <svg className="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm text-slate-600 dark:text-slate-400 loading-dots">Generating your content</p>
          </div>
        ) : content ? (
          getPlatformSpecificUI()
        ) : (
          <div className="text-center p-8">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your content preview will appear here
            </p>
          </div>
        )}
      </div>
      
      {!loading && content && contentForExport && (
        <div className="flex justify-center pt-4 pb-6 gap-3 flex-wrap border-t border-primary/10">
          <Button
            variant="outline"
            size="sm"
            className="flex gap-1 btn-transition bg-white/50 dark:bg-slate-800/50 hover:bg-primary/10 hover:text-primary"
            onClick={handleCopy}
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copy</span>
          </Button>
          
          <ExportDialog 
            content={contentForExport} 
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="flex gap-1 btn-transition bg-white/50 dark:bg-slate-800/50 hover:bg-accent/10 hover:text-accent"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export</span>
              </Button>
            }
          />
          
          <ScheduleDialog 
            content={contentForExport} 
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="flex gap-1 btn-transition bg-white/50 dark:bg-slate-800/50 hover:bg-primary/10 hover:text-primary"
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Schedule</span>
              </Button>
            }
          />
          
          <Button
            variant={isSaved ? "secondary" : "outline"}
            size="sm"
            className={`flex gap-1 btn-transition ${isSaved ? "bg-secondary/80" : "bg-white/50 dark:bg-slate-800/50 hover:bg-secondary/10 hover:text-secondary"}`}
            onClick={handleSave}
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </Button>
        </div>
      )}
    </div>
  );
}