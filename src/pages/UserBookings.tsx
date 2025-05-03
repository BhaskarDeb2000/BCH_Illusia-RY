import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  getUserBookings,
  updateBooking,
  cancelBooking,
} from "@/lib/api/bookings";
import { BookingForm } from "@/components/BookingForm";
import { BookingStatus } from "@/types";

export function UserBookings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["userBookings"],
    queryFn: () => getUserBookings(supabase.auth.user()?.id || ""),
  });

  const { mutate: updateBookingStatus } = useMutation({
    mutationFn: updateBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });
      toast({
        title: "Booking Updated",
        description: "Your booking has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { mutate: cancelBookingRequest } = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings?.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.item?.name}</TableCell>
              <TableCell>
                {format(new Date(booking.start_date), "PPP")}
              </TableCell>
              <TableCell>{format(new Date(booking.end_date), "PPP")}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : booking.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {booking.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {booking.status === "pending" && (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBooking(booking.id)}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Booking</DialogTitle>
                            <DialogDescription>
                              Update your booking details
                            </DialogDescription>
                          </DialogHeader>
                          <BookingForm
                            itemId={booking.item_id}
                            onSuccess={() => {
                              setSelectedBooking(null);
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => cancelBookingRequest(booking.id)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {bookings?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No bookings found</p>
        </div>
      )}
    </div>
  );
}
