import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ContentType } from "@/lib/types";
import { Wand2, Settings } from "lucide-react";
import CategorySelector from "./category-selector";
import AdvancedOptions, { AdvancedOptions as AdvancedOptionsType, defaultAdvancedOptions } from "./advanced-options";

const formSchema = z.object({
  topic: z.string().min(3, { message: "Topic is required and must be at least 3 characters" }),
  tone: z.string(),
  keywords: z.string().optional(),
  audience: z.string(),
  contentType: z.string(),
  category: z.string().optional(),
});

export type ContentFormValues = z.infer<typeof formSchema>; 

// Extended form value including advanced options (passed to parent)
export interface ExtendedFormValues extends ContentFormValues {
  advancedOptions: AdvancedOptionsType;
}

interface ContentFormProps {
  onSubmit: (values: ExtendedFormValues) => void;
  isSubmitting: boolean;
  contentType: ContentType;
  setContentType: (contentType: ContentType) => void;
}

export default function ContentForm({ 
  onSubmit, 
  isSubmitting, 
  contentType,
  setContentType
}: ContentFormProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptionsType>(defaultAdvancedOptions);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      tone: "Professional",
      keywords: "",
      audience: "Small Business Owners",
      contentType: "postWithImage",
      category: "",
    },
  });

  const handleContentTypeChange = (value: string) => {
    setContentType(value as ContentType);
    form.setValue("contentType", value);
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    form.setValue("category", category);
  };
  
  const handleOptionsChange = (options: AdvancedOptionsType) => {
    setAdvancedOptions(options);
  };
  
  const handleFormSubmit = (values: ContentFormValues) => {
    // Include advanced options with the form values
    onSubmit({
      ...values,
      advancedOptions: advancedOptions
    });
  };

  return (
    <div className="glass-card overflow-hidden shadow-lg">
      <div className="border-b border-primary/10 px-6 py-4 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10">
        <h3 className="text-lg font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Generate Content</h3>
      </div>
      <div className="p-6 glass bg-white/30 dark:bg-slate-900/30">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-5 shadow-sm">
              <h4 className="text-base font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">Content Type</h4>
              <RadioGroup 
                defaultValue={contentType} 
                onValueChange={handleContentTypeChange}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-2 hover:bg-primary/5 rounded-lg transition-colors">
                  <RadioGroupItem value="postWithImage" id="postWithImage" className="text-primary" />
                  <Label htmlFor="postWithImage" className="text-sm font-medium cursor-pointer">Post with Image</Label>
                </div>
                <div className="flex items-center space-x-3 p-2 hover:bg-primary/5 rounded-lg transition-colors">
                  <RadioGroupItem value="postWithVideo" id="postWithVideo" className="text-primary" />
                  <Label htmlFor="postWithVideo" className="text-sm font-medium cursor-pointer">Post with Video</Label>
                </div>
                <div className="flex items-center space-x-3 p-2 hover:bg-primary/5 rounded-lg transition-colors">
                  <RadioGroupItem value="carousel" id="carousel" className="text-primary" />
                  <Label htmlFor="carousel" className="text-sm font-medium cursor-pointer">Carousel</Label>
                </div>
                <div className="flex items-center space-x-3 p-2 hover:bg-primary/5 rounded-lg transition-colors">
                  <RadioGroupItem value="story" id="story" className="text-primary" />
                  <Label htmlFor="story" className="text-sm font-medium cursor-pointer">Story</Label>
                </div>
                <div className="flex items-center space-x-3 p-2 hover:bg-primary/5 rounded-lg transition-colors">
                  <RadioGroupItem value="textOnly" id="textOnly" className="text-primary" />
                  <Label htmlFor="textOnly" className="text-sm font-medium cursor-pointer">Text Only</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl">
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Topic</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g. Digital Marketing Tips"
                        disabled={isSubmitting}
                        className="bg-white/70 dark:bg-slate-700/70 border-slate-200 dark:border-slate-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl">
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Tone</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/70 dark:bg-slate-700/70 border-slate-200 dark:border-slate-600">
                          <SelectValue placeholder="Select a tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Casual">Casual</SelectItem>
                        <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                        <SelectItem value="Informative">Informative</SelectItem>
                        <SelectItem value="Humorous">Humorous</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl">
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Keywords <span className="text-xs text-slate-500">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="strategy, growth, leads"
                        disabled={isSubmitting}
                        className="bg-white/70 dark:bg-slate-700/70 border-slate-200 dark:border-slate-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="audience"
                render={({ field }) => (
                  <FormItem className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl">
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Target Audience</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/70 dark:bg-slate-700/70 border-slate-200 dark:border-slate-600">
                          <SelectValue placeholder="Select an audience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Friends and Family">Friends and Family</SelectItem>
                        <SelectItem value="Small Business Owners">Small Business Owners</SelectItem>
                        <SelectItem value="Marketing Professionals">Marketing Professionals</SelectItem>
                        <SelectItem value="Entrepreneurs">Entrepreneurs</SelectItem>
                        <SelectItem value="Working Professionals">Working Professionals</SelectItem>
                        <SelectItem value="Students">Students</SelectItem>
                        <SelectItem value="Parents">Parents</SelectItem>
                        <SelectItem value="Tech Enthusiasts">Tech Enthusiasts</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl">
              <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</FormLabel>
              <CategorySelector 
                selectedCategory={selectedCategory} 
                onCategoryChange={handleCategoryChange} 
              />
            </div>

            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 hover:bg-primary/10 hover:text-primary btn-transition"
              >
                <Settings className="h-4 w-4" />
                {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
              </Button>
            </div>

            {showAdvanced && (
              <div className="bg-white/50 dark:bg-slate-800/50 p-5 rounded-xl glass-card border border-primary/10">
                <h4 className="text-base font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">Advanced Options</h4>
                <AdvancedOptions 
                  options={advancedOptions} 
                  onChange={handleOptionsChange}
                  platform={form.getValues().contentType as any}
                />
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-md btn-transition"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}