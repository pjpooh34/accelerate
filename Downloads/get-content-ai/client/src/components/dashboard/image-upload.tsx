import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, 
  Image as ImageIcon, 
  Wand2, 
  X, 
  Download,
  Crop,
  RotateCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Platform } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface ImageUploadProps {
  platform: Platform;
  onImageSelect: (imageUrl: string) => void;
  selectedImageUrl?: string;
}

// Platform-specific image dimensions
const platformDimensions = {
  instagram: { width: 1080, height: 1080, name: "Instagram Square" },
  twitter: { width: 1200, height: 675, name: "Twitter Banner" },
  facebook: { width: 1200, height: 630, name: "Facebook Post" },
  linkedin: { width: 1200, height: 627, name: "LinkedIn Post" }
};

export default function ImageUpload({ platform, onImageSelect, selectedImageUrl }: ImageUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(selectedImageUrl || null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const dimensions = platformDimensions[platform];

  // AI Image Generation Mutation
  const generateImageMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest("POST", "/api/generate-image", {
        prompt,
        platform,
        dimensions: dimensions
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.imageUrl) {
        setUploadedImage(data.imageUrl);
        onImageSelect(data.imageUrl);
        toast({
          title: "Image generated!",
          description: "Your AI-generated image is ready to use",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate image",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, GIF)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setUploadedImage(imageUrl);
      onImageSelect(imageUrl);
      
      toast({
        title: "Image uploaded!",
        description: "Your image is ready to use",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateImage = () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Enter a prompt",
        description: "Please describe the image you want to generate",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    generateImageMutation.mutate(aiPrompt);
  };

  const removeImage = () => {
    setUploadedImage(null);
    onImageSelect("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadImage = () => {
    if (!uploadedImage) return;
    
    const link = document.createElement('a');
    link.href = uploadedImage;
    link.download = `${platform}-image-${Date.now()}.png`;
    link.click();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ImageIcon className="w-5 h-5 text-blue-500" />
          Image for {platform.charAt(0).toUpperCase() + platform.slice(1)}
          <span className="text-sm font-normal text-gray-500">
            ({dimensions.width} × {dimensions.height})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Image
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              AI Generate
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            {!uploadedImage ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload your image
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports JPG, PNG, GIF up to 10MB
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  Choose File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="max-w-full h-auto max-h-64 mx-auto rounded"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={downloadImage}
                      className="bg-white/90 hover:bg-white"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={removeImage}
                      className="bg-red-500/90 hover:bg-red-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    Replace Image
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="generate" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="ai-prompt">Describe your image</Label>
                <Textarea
                  id="ai-prompt"
                  placeholder="A modern office with people working on laptops, bright and professional atmosphere..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="min-h-20"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific! Describe style, colors, mood, and details for best results.
                </p>
              </div>
              
              <Button
                onClick={handleGenerateImage}
                disabled={isGenerating || !aiPrompt.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
              
              {uploadedImage && (
                <div className="space-y-4">
                  <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                    <img
                      src={uploadedImage}
                      alt="AI Generated"
                      className="max-w-full h-auto max-h-64 mx-auto rounded"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={downloadImage}
                        className="bg-white/90 hover:bg-white"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={removeImage}
                        className="bg-red-500/90 hover:bg-red-500"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>💡 <strong>Pro Tips:</strong></p>
              <p>• Include style keywords: "photorealistic", "cartoon", "minimalist"</p>
              <p>• Specify colors: "vibrant blue background", "warm golden lighting"</p>
              <p>• Add mood: "professional", "fun", "energetic", "calm"</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}