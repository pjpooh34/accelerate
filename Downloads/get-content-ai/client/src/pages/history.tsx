import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import SEO from "@/components/layout/seo";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Platform } from "@/lib/types";
import { Calendar, Download, MoreHorizontal, Search, Filter, ArrowUpDown } from "lucide-react";

export default function History() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Sample history data
  const historyItems = [
    {
      id: "1",
      title: "Summer Sale Announcement",
      platform: "instagram" as Platform,
      createdAt: "2023-05-10T14:30:00Z",
      status: "published"
    },
    {
      id: "2",
      title: "Product Launch Teaser",
      platform: "twitter" as Platform,
      createdAt: "2023-05-05T10:15:00Z",
      status: "scheduled"
    },
    {
      id: "3",
      title: "Customer Testimonial Highlight",
      platform: "facebook" as Platform,
      createdAt: "2023-05-01T09:45:00Z",
      status: "draft"
    },
    {
      id: "4",
      title: "Industry News Update",
      platform: "linkedin" as Platform,
      createdAt: "2023-04-28T16:20:00Z",
      status: "published"
    },
    {
      id: "5",
      title: "Weekly Tips Series",
      platform: "instagram" as Platform,
      createdAt: "2023-04-21T11:30:00Z",
      status: "archived"
    },
    {
      id: "6",
      title: "Company Milestone Celebration",
      platform: "facebook" as Platform,
      createdAt: "2023-04-15T13:45:00Z",
      status: "published"
    },
    {
      id: "7",
      title: "Product Feature Spotlight",
      platform: "twitter" as Platform,
      createdAt: "2023-04-10T15:10:00Z",
      status: "draft"
    },
    {
      id: "8",
      title: "Hiring Announcement",
      platform: "linkedin" as Platform,
      createdAt: "2023-04-05T09:30:00Z",
      status: "published"
    },
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "draft":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "archived":
        return "bg-slate-100 text-slate-800 dark:bg-slate-700/30 dark:text-slate-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case "instagram":
        return "bg-secondary";
      case "twitter":
        return "bg-primary";
      case "facebook":
        return "bg-blue-600";
      case "linkedin":
        return "bg-accent";
      default:
        return "bg-slate-500";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your content history is being exported as CSV."
    });
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Edit content",
      description: "Editing content ID: " + id
    });
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Content deleted",
      description: "Content has been removed from your history."
    });
  };

  const handleView = (id: string) => {
    toast({
      title: "View content",
      description: "Viewing content details for ID: " + id
    });
  };

  const filteredHistory = historyItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO 
        title="Content History | Get Content AI"
        description="View and manage your content creation history. Track, edit, and export your social media content for multiple platforms."
        keywords="content history, social media posts, content tracking, content management, post history"
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center">
          <div className="h-10 w-1.5 bg-gradient-to-b from-primary via-secondary to-accent rounded-full mr-4"></div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">Content History</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              className="pl-9 w-full sm:w-[250px] focus-ring" 
              placeholder="Search content..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="shrink-0">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="shrink-0" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
      
      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[300px]">
                  <div className="flex items-center gap-1">
                    Title
                    <ArrowUpDown className="h-3 w-3 text-slate-500" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Platform
                    <ArrowUpDown className="h-3 w-3 text-slate-500" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Created
                    <ArrowUpDown className="h-3 w-3 text-slate-500" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <p className="text-slate-500 dark:text-slate-400">No content history found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredHistory.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <TableCell>
                      <div className={`w-3 h-3 rounded-full ${getPlatformIcon(item.platform)}`}></div>
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}</TableCell>
                    <TableCell>{formatDate(item.createdAt)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(item.id)}>
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(item.id)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}