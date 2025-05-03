import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getItemBookings, updateBooking } from "@/lib/api/bookings";
import { BookingStatus } from "@/types";

export function AdminBookings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["adminBookings", selectedItem],
    queryFn: () => getItemBookings(selectedItem || ""),
    enabled: !!selectedItem,
  });

  const { mutate: updateBookingStatus } = useMutation({
    mutationFn: updateBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      toast({
        title: "Booking Updated",
        description: "The booking status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    updateBookingStatus({
      bookingId,
      status: newStatus,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Bookings</h1>

      <div className="mb-6">
        <Select onValueChange={setSelectedItem}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            {/* TODO: Add items list */}
            <SelectItem value="1">Item 1</SelectItem>
            <SelectItem value="2">Item 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings?.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.user?.full_name}</TableCell>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(booking.id, "approved")
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(booking.id, "rejected")
                        }
                      >
                        Reject
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
