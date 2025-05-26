import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Copy, Download, Share2, RefreshCw } from 'lucide-react';
import { ContentResponse, ContentVariation, Platform } from '../../lib/types';
import { toast } from 'sonner';

interface ContentPreviewProps {
  platform: Platform;
  mainContent: ContentResponse;
  variations: ContentVariation[];
  onRefresh?: () => void;
  onCopy?: (content: string) => void;
  onDownload?: (content: ContentResponse | ContentVariation) => void;
  onShare?: (content: ContentResponse | ContentVariation) => void;
}

export const ContentPreview: React.FC<ContentPreviewProps> = ({
  platform,
  mainContent,
  variations,
  onRefresh,
  onCopy,
  onDownload,
  onShare
}) => {
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Content copied to clipboard!');
    onCopy?.(content);
  };

  const handleDownload = (content: ContentResponse | ContentVariation) => {
    // Create a text file with the content
    const text = 'title' in content && content.title 
      ? `${content.title}\n\n${content.content}` 
      : content.content;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${platform}-content-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Content downloaded!');
    onDownload?.(content);
  };

  const handleShare = (content: ContentResponse | ContentVariation) => {
    if (navigator.share) {
      const text = 'title' in content && content.title 
        ? `${content.title}\n\n${content.content}` 
        : content.content;
      
      navigator.share({
        title: `${platform} Content`,
        text: text
      }).catch(() => {
        // User cancelled share
      });
    } else {
      // Fallback to copy
      handleCopy(content.content);
    }
    onShare?.(content);
  };

  return (
    <div className="space-y-6">
      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Main Content</span>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleCopy(mainContent.content)}
                title="Copy content"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDownload(mainContent)}
                title="Download content"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleShare(mainContent)}
                title="Share content"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              {onRefresh && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onRefresh}
                  title="Regenerate content"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mainContent.title && (
            <h3 className="text-lg font-semibold">{mainContent.title}</h3>
          )}
          <p className="whitespace-pre-wrap">{mainContent.content}</p>
          
          {/* Display image if available */}
          {mainContent.imageUrl && (
            <div className="mt-4">
              <img 
                src={mainContent.imageUrl} 
                alt="Generated content" 
                className="w-full rounded-lg shadow-md"
              />
            </div>
          )}
          
          {/* Display video if available */}
          {mainContent.videoUrl && (
            <div className="mt-4">
              <video 
                src={mainContent.videoUrl} 
                controls
                className="w-full rounded-lg shadow-md"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Variations */}
      {variations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Variations</h3>
          {variations.map((variation, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm">
                  <span>Variation {index + 1}</span>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleCopy(variation.content)}
                      title="Copy variation"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDownload(variation)}
                      title="Download variation"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleShare(variation)}
                      title="Share variation"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {variation.title && (
                  <h4 className="font-medium mb-2">{variation.title}</h4>
                )}
                <p className="whitespace-pre-wrap">{variation.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};