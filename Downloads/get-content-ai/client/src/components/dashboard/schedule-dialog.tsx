import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Check } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Content } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Generate time options in 15-minute intervals
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const hourFormatted = hour.toString().padStart(2, '0');
      const minuteFormatted = minute.toString().padStart(2, '0');
      const time = `${hourFormatted}:${minuteFormatted}`;
      const label = format(new Date(2022, 1, 1, hour, minute), 'h:mm a');
      options.push({ value: time, label });
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

interface ScheduleDialogProps {
  content: Content;
  trigger?: React.ReactNode;
}

export default function ScheduleDialog({ content, trigger }: ScheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledSuccess, setScheduledSuccess] = useState(false);
  const [notifyByEmail, setNotifyByEmail] = useState(true);
  const { toast } = useToast();

  const handleSchedule = async () => {
    if (!date) {
      toast({
        title: "Select a date",
        description: "Please select a date to schedule your content",
        variant: "destructive"
      });
      return;
    }

    setIsScheduling(true);

    try {
      // Combine date and time
      const scheduledDateTime = new Date(date);
      const [hours, minutes] = time.split(':').map(Number);
      scheduledDateTime.setHours(hours, minutes);

      // Check if scheduled time is in the past
      if (scheduledDateTime <= new Date()) {
        toast({
          title: "Invalid schedule time",
          description: "Schedule time must be in the future",
          variant: "destructive"
        });
        setIsScheduling(false);
        return;
      }

      // Here we would normally send an API request to save the schedule
      // For demonstration, we'll simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setScheduledSuccess(true);
      toast({
        title: "Content scheduled",
        description: `Your content has been scheduled for ${format(scheduledDateTime, 'PPP')} at ${format(scheduledDateTime, 'h:mm a')}`,
      });

      // Reset dialog after 2 seconds
      setTimeout(() => {
        setOpen(false);
        setScheduledSuccess(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Scheduling failed",
        description: "There was a problem scheduling your content",
        variant: "destructive"
      });
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Post</DialogTitle>
          <DialogDescription>
            Choose when to publish your content on {content.platform}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <div className="col-span-3">
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notifyByEmail" 
                  checked={notifyByEmail} 
                  onCheckedChange={(checked) => setNotifyByEmail(checked as boolean)}
                />
                <Label htmlFor="notifyByEmail">Notify me by email when content is posted</Label>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleSchedule} 
            disabled={isScheduling || scheduledSuccess || !date}
          >
            {isScheduling ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scheduling...
              </>
            ) : scheduledSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Scheduled
              </>
            ) : (
              "Schedule"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}