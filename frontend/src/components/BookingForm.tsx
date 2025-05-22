import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { createBooking } from "@/lib/api/bookings";

const bookingFormSchema = z
  .object({
    startDate: z.date({
      required_error: "Please select a start date",
    }),
    endDate: z.date({
      required_error: "Please select an end date",
    }),
    specialRequests: z.string().optional(),
  })
  .refine(
    (data) => {
      // Ensure end date is after start date
      return data.endDate > data.startDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      // Ensure booking duration is not more than 30 days
      const diffTime = Math.abs(
        data.endDate.getTime() - data.startDate.getTime()
      );
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    },
    {
      message: "Booking duration cannot exceed 30 days",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      // Ensure booking is at least 24 hours in advance
      const now = new Date();
      const minStartDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      return data.startDate >= minStartDate;
    },
    {
      message: "Booking must be made at least 24 hours in advance",
      path: ["startDate"],
    }
  );

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  itemId: string;
  onSuccess?: () => void;
}

export function BookingForm({ itemId, onSuccess }: BookingFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      specialRequests: "",
    },
  });

  const { mutate: submitBooking } = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast({
        title: "Booking Request Submitted",
        description: "Your booking request has been submitted successfully.",
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit booking request. Please try again.",
        variant: "destructive",
      });
    },
  });

  async function onSubmit(data: BookingFormValues) {
    setIsSubmitting(true);
    try {
      submitBooking({
        itemId,
        startDate: data.startDate,
        endDate: data.endDate,
        specialRequests: data.specialRequests,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date > new Date("2100-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select the date you want to start your booking
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date > new Date("2100-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select the date you want to end your booking
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialRequests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Requests</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special requirements or requests..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Add any special requirements or requests for your booking
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Booking Request"}
        </Button>
      </form>
    </Form>
  );
}
