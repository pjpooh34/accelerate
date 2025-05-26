import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/layout/seo";

export default function Templates() {
  const { toast } = useToast();

  const handleUseTemplate = () => {
    toast({
      title: "Template Selected",
      description: "Template functionality will be available soon.",
    });
  };

  const templates = [
    {
      id: 1,
      title: "Product Launch",
      description: "Announce your new product or service with engaging copy.",
      platforms: ["instagram", "twitter", "facebook"],
      category: "Marketing"
    },
    {
      id: 2,
      title: "Weekly Update",
      description: "Keep your audience informed with weekly highlights.",
      platforms: ["linkedin", "facebook"],
      category: "Newsletter"
    },
    {
      id: 3,
      title: "Event Promotion",
      description: "Promote upcoming events and generate excitement.",
      platforms: ["instagram", "twitter", "facebook", "linkedin"],
      category: "Events"
    },
    {
      id: 4,
      title: "Customer Testimonial",
      description: "Share positive customer experiences with your audience.",
      platforms: ["instagram", "facebook", "linkedin"],
      category: "Social Proof"
    },
    {
      id: 5,
      title: "How-To Guide",
      description: "Educational content that showcases your expertise.",
      platforms: ["linkedin", "facebook"],
      category: "Educational"
    },
    {
      id: 6,
      title: "Industry News",
      description: "Share insights on trending topics in your industry.",
      platforms: ["twitter", "linkedin"],
      category: "News"
    }
  ];

  // Function to get platform badge color
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "instagram":
        return "bg-secondary/10 text-secondary";
      case "twitter":
        return "bg-primary/10 text-primary";
      case "facebook":
        return "bg-blue-600/10 text-blue-600";
      case "linkedin":
        return "bg-accent/10 text-accent";
      default:
        return "bg-slate-200 text-slate-700";
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO 
        title="Content Templates | Get Content AI"
        description="Browse our collection of professional content templates for social media. Save time with pre-designed templates for product launches, updates, events, and more."
        keywords="content templates, social media templates, marketing templates, content creation, social media strategy"
      />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Content Templates</h1>
        <Button variant="outline" className="hidden sm:flex">Filter Templates</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden hover-card">
            <CardHeader className="pb-4 border-b bg-gradient-to-r from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900/80">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none"></div>
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">{template.title}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {template.platforms.map((platform) => (
                  <span 
                    key={platform} 
                    className={`text-xs font-medium px-2 py-1 rounded-full ${getPlatformColor(platform)}`}
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </span>
                ))}
              </div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Category: {template.category}
              </div>
            </CardContent>
            
            <CardFooter className="border-t bg-slate-50 dark:bg-slate-900/50 pt-4">
              <Button onClick={handleUseTemplate} variant="default" className="w-full">
                Use Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}