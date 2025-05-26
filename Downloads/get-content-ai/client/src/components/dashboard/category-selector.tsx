import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Default categories
const DEFAULT_CATEGORIES = [
  { value: "fun", label: "Fun" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "promotional", label: "Promotional" },
  { value: "announcement", label: "Announcement" },
  { value: "product", label: "Product" },
  { value: "event", label: "Event" },
  { value: "educational", label: "Educational" },
  { value: "inspiration", label: "Inspiration" },
];

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategorySelector({
  selectedCategory,
  onCategoryChange,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const { toast } = useToast();

  const handleCreateCategory = () => {
    if (!customCategory.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const value = customCategory.toLowerCase().replace(/\s+/g, "-");
    
    // Check if category already exists
    if (categories.some(cat => cat.value === value)) {
      toast({
        title: "Error",
        description: "This category already exists",
        variant: "destructive",
      });
      return;
    }
    
    const newCategory = { value, label: customCategory.trim() };
    setCategories([...categories, newCategory]);
    setCustomCategory("");
    setDialogOpen(false);
    
    // Select the newly created category
    onCategoryChange(value);
    setOpen(false);
    
    toast({
      title: "Success",
      description: `Category "${customCategory}" created successfully`,
    });
  };

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCategory
              ? categories.find((category) => category.value === selectedCategory)?.label
              : "Select category..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search category..." />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup heading="Categories">
                {categories.map((category) => (
                  <CommandItem
                    key={category.value}
                    value={category.value}
                    onSelect={(currentValue) => {
                      onCategoryChange(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategory === category.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {category.label}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Create new category</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Category</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Category Name</Label>
                        <Input
                          id="name"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="Enter category name"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="button" onClick={handleCreateCategory}>Create</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedCategory && (
        <Badge variant="secondary" className="ml-2">
          {categories.find((category) => category.value === selectedCategory)?.label}
        </Badge>
      )}
    </div>
  );
}