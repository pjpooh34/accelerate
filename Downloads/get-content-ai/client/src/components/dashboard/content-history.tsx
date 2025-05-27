import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContentHistory } from "@/lib/types";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface ContentHistoryProps {
  historyItems: ContentHistory[];
  loading: boolean;
}

export default function ContentHistoryComponent({ historyItems, loading }: ContentHistoryProps) {
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    toast({
      title: "Delete functionality",
      description: "This feature is not implemented in the demo",
    });
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Edit functionality",
      description: "This feature is not implemented in the demo",
    });
  };

  return (
    <Card>
      <CardHeader className="border-b flex flex-row items-center justify-between">
        <CardTitle>Recent Content</CardTitle>
        <Button variant="ghost" size="sm" className="text-sm text-primary hover:text-primary/80 p-0 h-auto font-medium" asChild>
          <Link href="/history">View All</Link>
        </Button>
      </CardHeader>
      
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {loading ? (
          <div className="p-8 text-center">
            <svg className="animate-spin h-6 w-6 text-primary mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm text-slate-600 dark:text-slate-400">Loading history...</p>
          </div>
        ) : historyItems.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">No content history yet</p>
          </div>
        ) : (
          historyItems.map((item) => (
            <div key={item.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center">
              <div className="w-14 h-14 rounded bg-slate-200 dark:bg-slate-700 flex-shrink-0 mr-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 dark:text-slate-400">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.title}</h3>
                <p className="text-xs text-slate-500">{item.platform} • Created {item.createdAt}</p>
              </div>
              
              <div className="flex-shrink-0 ml-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(item.id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
