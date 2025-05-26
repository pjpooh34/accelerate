import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface AdvancedOptions {
  creativity: number;
  maxLength: number;
  includeEmojis: boolean;
  includeCTA: boolean;
  includeHashtags: boolean;
  customHashtags: string[];
  avoidWords: string[];
  contentStyle: string;
  languageModel: string;
}

export const defaultAdvancedOptions: AdvancedOptions = {
  creativity: 0.7,
  maxLength: 280,
  includeEmojis: true,
  includeCTA: true,
  includeHashtags: true,
  customHashtags: [],
  avoidWords: [],
  contentStyle: "balanced",
  languageModel: "openai",
};

interface AdvancedOptionsProps {
  options: AdvancedOptions;
  onChange: (options: AdvancedOptions) => void;
  platform: string;
}

export default function AdvancedOptions({ options, onChange, platform }: AdvancedOptionsProps) {
  const [newHashtag, setNewHashtag] = useState("");
  const [newAvoidWord, setNewAvoidWord] = useState("");

  const handleSliderChange = (name: keyof AdvancedOptions, value: number[]) => {
    onChange({
      ...options,
      [name]: value[0],
    });
  };

  const handleSwitchChange = (name: keyof AdvancedOptions, checked: boolean) => {
    onChange({
      ...options,
      [name]: checked,
    });
  };

  const handleSelectChange = (name: keyof AdvancedOptions, value: string) => {
    onChange({
      ...options,
      [name]: value,
    });
  };

  const addHashtag = () => {
    if (newHashtag.trim() && !options.customHashtags.includes(newHashtag.trim())) {
      onChange({
        ...options,
        customHashtags: [...options.customHashtags, newHashtag.trim()],
      });
      setNewHashtag("");
    }
  };

  const removeHashtag = (tag: string) => {
    onChange({
      ...options,
      customHashtags: options.customHashtags.filter((t) => t !== tag),
    });
  };

  const addAvoidWord = () => {
    if (newAvoidWord.trim() && !options.avoidWords.includes(newAvoidWord.trim())) {
      onChange({
        ...options,
        avoidWords: [...options.avoidWords, newAvoidWord.trim()],
      });
      setNewAvoidWord("");
    }
  };

  const removeAvoidWord = (word: string) => {
    onChange({
      ...options,
      avoidWords: options.avoidWords.filter((w) => w !== word),
    });
  };

  // Get platform specific max length
  const getMaxLength = () => {
    switch (platform) {
      case "twitter":
        return 280;
      case "linkedin":
        return 3000;
      case "facebook":
        return 5000;
      case "instagram":
        return 2200;
      default:
        return 3000;
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="advanced-options">
        <AccordionTrigger className="text-sm font-medium">
          Advanced Customization Options
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          {/* Creativity Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="creativity" className="text-sm">
                Creativity Level
              </Label>
              <span className="text-xs text-slate-500">
                {options.creativity < 0.4
                  ? "Conservative"
                  : options.creativity < 0.7
                  ? "Balanced"
                  : "Creative"}
              </span>
            </div>
            <Slider
              id="creativity"
              min={0.1}
              max={1}
              step={0.1}
              value={[options.creativity]}
              onValueChange={(value) => handleSliderChange("creativity", value)}
            />
            <p className="text-xs text-slate-500">
              Lower values produce more predictable content, higher values produce more creative and varied content.
            </p>
          </div>

          {/* Max Length */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="maxLength" className="text-sm">
                Maximum Length
              </Label>
              <span className="text-xs text-slate-500">{options.maxLength} characters</span>
            </div>
            <Slider
              id="maxLength"
              min={50}
              max={getMaxLength()}
              step={10}
              value={[options.maxLength]}
              onValueChange={(value) => handleSliderChange("maxLength", value)}
            />
            <p className="text-xs text-slate-500">
              Maximum character length for the generated content. Platform limit: {getMaxLength()} characters.
            </p>
          </div>

          {/* Style Selection */}
          <div className="space-y-2">
            <Label htmlFor="contentStyle" className="text-sm">
              Content Style
            </Label>
            <Select
              value={options.contentStyle}
              onValueChange={(value) => handleSelectChange("contentStyle", value)}
            >
              <SelectTrigger id="contentStyle">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="formal">Formal & Professional</SelectItem>
                <SelectItem value="friendly">Friendly & Conversational</SelectItem>
                <SelectItem value="persuasive">Persuasive & Sales-Oriented</SelectItem>
                <SelectItem value="educational">Educational & Informative</SelectItem>
                <SelectItem value="storytelling">Storytelling</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="languageModel" className="text-sm">
              AI Model
            </Label>
            <Select
              value={options.languageModel}
              onValueChange={(value) => handleSelectChange("languageModel", value)}
            >
              <SelectTrigger id="languageModel">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI GPT-4o (Premium)</SelectItem>
                <SelectItem value="claude">Claude 3.7 Sonnet (Premium)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">
              Select the AI model to generate your content. GPT-4o provides higher quality outputs.
            </p>
          </div>

          {/* Include Emojis */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="includeEmojis" className="text-sm">
                Include Emojis
              </Label>
              <p className="text-xs text-slate-500">
                Add relevant emojis to make your content more engaging
              </p>
            </div>
            <Switch
              id="includeEmojis"
              checked={options.includeEmojis}
              onCheckedChange={(checked) => handleSwitchChange("includeEmojis", checked)}
            />
          </div>

          {/* Include Call to Action */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="includeCTA" className="text-sm">
                Include Call to Action
              </Label>
              <p className="text-xs text-slate-500">
                Add a clear call to action at the end of your content
              </p>
            </div>
            <Switch
              id="includeCTA"
              checked={options.includeCTA}
              onCheckedChange={(checked) => handleSwitchChange("includeCTA", checked)}
            />
          </div>

          {/* Include Hashtags */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="includeHashtags" className="text-sm">
                Include Hashtags
              </Label>
              <p className="text-xs text-slate-500">
                Generate relevant hashtags based on your content
              </p>
            </div>
            <Switch
              id="includeHashtags"
              checked={options.includeHashtags}
              onCheckedChange={(checked) => handleSwitchChange("includeHashtags", checked)}
            />
          </div>

          {/* Custom Hashtags */}
          {options.includeHashtags && (
            <div className="space-y-2 pt-2">
              <Label htmlFor="customHashtags" className="text-sm">
                Custom Hashtags
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="customHashtags"
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  placeholder="Enter hashtag"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addHashtag();
                    }
                  }}
                />
                <Button type="button" size="sm" onClick={addHashtag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {options.customHashtags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1 py-1">
                    #{tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 text-slate-500 hover:text-slate-700"
                      onClick={() => removeHashtag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Words to Avoid */}
          <div className="space-y-2 pt-2">
            <Label htmlFor="avoidWords" className="text-sm">
              Words to Avoid
            </Label>
            <div className="flex space-x-2">
              <Input
                id="avoidWords"
                value={newAvoidWord}
                onChange={(e) => setNewAvoidWord(e.target.value)}
                placeholder="Enter word or phrase"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAvoidWord();
                  }
                }}
              />
              <Button type="button" size="sm" onClick={addAvoidWord}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {options.avoidWords.map((word) => (
                <Badge key={word} variant="outline" className="flex items-center gap-1 py-1">
                  {word}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 text-slate-500 hover:text-slate-700"
                    onClick={() => removeAvoidWord(word)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Specify words or phrases you want to avoid in the generated content.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}