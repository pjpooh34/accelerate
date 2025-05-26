import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContentVariation } from "@/lib/types";
import { Pen, Star, SlidersHorizontal, RotateCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentVariationsProps {
  variations: ContentVariation[];
  loading: boolean;
  onSelectVariation: (variation: ContentVariation) => void;
  onGenerateMore: () => void;
  isGeneratingMore: boolean;
}

export default function ContentVariations({ 
  variations, 
  loading, 
  onSelectVariation, 
  onGenerateMore,
  isGeneratingMore
}: ContentVariationsProps) {
  const { toast } = useToast();

  const handleEdit = (variation: ContentVariation) => {
    // In a real app, this would open an editor
    toast({
      title: "Edit functionality",
      description: "This feature is not implemented in the demo",
    });
  };

  const handleSave = (variation: ContentVariation) => {
    // In a real app, this would save the variation
    toast({
      title: "Saved to favorites",
      description: "Content variation has been saved to your favorites",
    });
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Other Variations</CardTitle>
      </CardHeader>
      
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {variations.map((variation, index) => (
          <div 
            key={index} 
            className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            onClick={() => onSelectVariation(variation)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium dark:text-white">Variation #{index + 1}</h3>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(variation);
                  }}
                  className="p-1.5 text-xs text-slate-500 hover:text-primary"
                >
                  <Pen className="h-3 w-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave(variation);
                  }}
                  className="p-1.5 text-xs text-slate-500 hover:text-primary"
                >
                  <Star className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3 whitespace-pre-line">
              {variation.content}
            </p>
          </div>
        ))}
        
        {loading && (
          <div className="p-5 text-center text-slate-500">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="loading-dots">Generating more variations</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {variations.length > 0 && (
        <CardFooter className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm"
            className="text-primary hover:bg-white dark:hover:bg-slate-800"
          >
            <SlidersHorizontal className="h-4 w-4 mr-1.5" /> Adjust Parameters
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={onGenerateMore}
            disabled={isGeneratingMore}
          >
            {isGeneratingMore ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <RotateCw className="h-4 w-4 mr-1.5" /> Generate More
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
