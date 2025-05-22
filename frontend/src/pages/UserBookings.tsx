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
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";

export function UserBookings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["userBookings", page, pageSize, searchQuery],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      return getUserBookings(user.id, page, pageSize, searchQuery);
    },
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

  const bookings = bookingsData?.data || [];
  const total = bookingsData?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search bookings..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1); // Reset to first page on search
          }}
          className="max-w-sm"
        />
      </div>

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
          {bookings.map((booking) => (
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

      {bookings.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No bookings found</p>
        </div>
      )}

      {total > 0 && (
        <div className="flex justify-center mt-4 gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="py-2 px-4">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
