import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Content } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, Share2, FileText, FileEdit } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

export default function SavedContent() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Redirect if not authenticated
  if (!authLoading && !user) {
    navigate("/login");
  }
  
  // Fetch saved content
  const { data: savedContent, isLoading } = useQuery({
    queryKey: ["/api/content/saved"],
    enabled: !!user,
  });
  
  // Remove from saved content
  const removeMutation = useMutation({
    mutationFn: async (contentId: number) => {
      const response = await fetch("/api/content/unsave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contentId }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to remove content from favorites");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Content removed from favorites",
        description: "The content was successfully removed from your favorites",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/content/saved"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleRemove = (contentId: number) => {
    removeMutation.mutate(contentId);
  };
  
  const getPlatformStyles = (platform: string) => {
    switch (platform) {
      case "instagram":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
      case "twitter":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "facebook":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      case "linkedin":
        return "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">My Saved Content</h1>
      
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-[300px]">
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : savedContent?.length === 0 ? (
        <Card className="p-6 text-center">
          <CardTitle className="mb-2">No saved content yet</CardTitle>
          <CardDescription>
            Save your favorite generated content to access it quickly later!
          </CardDescription>
          <Button 
            onClick={() => navigate("/dashboard")} 
            className="mt-4"
          >
            Go to Dashboard
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {savedContent?.map((content: Content) => (
            <Card key={content.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="mr-4">{content.title}</CardTitle>
                  <Badge className={getPlatformStyles(content.platform)}>
                    {content.platform}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Clock size={14} />
                  {formatDistanceToNow(new Date(content.createdAt), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-3 mb-4">{content.content}</p>
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/content/${content.id}`)}>
                      <FileText className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileEdit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemove(content.id)}
                    disabled={removeMutation.isPending}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}