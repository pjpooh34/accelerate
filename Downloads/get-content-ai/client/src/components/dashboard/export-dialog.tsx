import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DownloadCloud, 
  Copy, 
  FileText, 
  Image,
  Share2, 
  Check, 
  AlertCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Content } from "@shared/schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ExportDialogProps {
  content: Content;
  trigger?: React.ReactNode;
}

export default function ExportDialog({ content, trigger }: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState("text");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Function to format content as markdown
  const formatAsMarkdown = () => {
    return `# ${content.title}\n\n${content.content}`;
  };

  // Function to format content as HTML
  const formatAsHTML = () => {
    return `<!DOCTYPE html>
<html>
<head>
  <title>${content.title}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
  </style>
</head>
<body>
  <h1>${content.title}</h1>
  <div>${content.content.replace(/\\n/g, '<br>')}</div>
</body>
</html>`;
  };

  // Copy content to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Content has been copied successfully"
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      toast({
        title: "Failed to copy",
        description: "Something went wrong while trying to copy the content",
        variant: "destructive"
      });
    });
  };

  // Export content 
  const exportContent = () => {
    setIsExporting(true);
    
    try {
      let data: string;
      let fileName: string;
      let mimeType: string;
      
      switch (exportFormat) {
        case "text":
          data = `${content.title}\n\n${content.content}`;
          fileName = `${content.title.toLowerCase().replace(/\\s+/g, '-')}.txt`;
          mimeType = "text/plain";
          break;
        case "markdown":
          data = formatAsMarkdown();
          fileName = `${content.title.toLowerCase().replace(/\\s+/g, '-')}.md`;
          mimeType = "text/markdown";
          break;
        case "html":
          data = formatAsHTML();
          fileName = `${content.title.toLowerCase().replace(/\\s+/g, '-')}.html`;
          mimeType = "text/html";
          break;
        default:
          data = `${content.title}\n\n${content.content}`;
          fileName = `${content.title.toLowerCase().replace(/\\s+/g, '-')}.txt`;
          mimeType = "text/plain";
      }
      
      // Create blob and download link
      const blob = new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: `Content exported as ${exportFormat.toUpperCase()}`
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Something went wrong while exporting",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <DownloadCloud className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Export Content</DialogTitle>
          <DialogDescription>
            Choose a format to export your content
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="text" className="mt-2" onValueChange={setExportFormat}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="border rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
            <h3 className="text-lg font-medium mb-2">{content.title}</h3>
            <p className="whitespace-pre-line">{content.content}</p>
          </TabsContent>
          
          <TabsContent value="markdown" className="border rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
            <pre className="whitespace-pre-line font-mono text-sm">{formatAsMarkdown()}</pre>
          </TabsContent>
          
          <TabsContent value="html" className="border rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
            <pre className="whitespace-pre-line font-mono text-xs">{formatAsHTML()}</pre>
          </TabsContent>
        </Tabs>
        
        {content.platform === "instagram" && content.contentType !== "textOnly" && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Image Export Not Available</AlertTitle>
            <AlertDescription>
              Image export is not available for this platform. Only text content will be exported.
            </AlertDescription>
          </Alert>
        )}
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button 
            variant="outline" 
            className="sm:mr-auto"
            onClick={() => copyToClipboard(
              exportFormat === "markdown" 
                ? formatAsMarkdown() 
                : exportFormat === "html" 
                  ? formatAsHTML() 
                  : `${content.title}\n\n${content.content}`
            )}
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
          
          <Button onClick={exportContent} disabled={isExporting}>
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <DownloadCloud className="mr-2 h-4 w-4" />
                Export as {exportFormat.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}