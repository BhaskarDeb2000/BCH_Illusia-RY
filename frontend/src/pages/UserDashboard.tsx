import { useState, useCallback } from "react";
import { format } from "date-fns";
import { fi } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Package,
  User,
  Settings,
  LogOut,
  ChevronRight,
  XCircle,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getUserBookings } from "@/lib/api/bookings";

// Utility functions
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return format(new Date(dateString), "dd.MM.yyyy", { locale: fi });
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "rejected":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "completed":
      return <CheckCircle className="h-5 w-5 text-blue-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusBadge = (status: string) => {
  const statusMap = {
    approved: { label: "Approved", variant: "default" },
    pending: { label: "Pending", variant: "secondary" },
    rejected: { label: "Rejected", variant: "destructive" },
    completed: { label: "Completed", variant: "outline" },
  };

  const { label, variant } = statusMap[status as keyof typeof statusMap] || {
    label: status,
    variant: "default",
  };

  return (
    <Badge
      variant={variant as "default" | "secondary" | "destructive" | "outline"}
    >
      {label}
    </Badge>
  );
};

// Mock user data
const user = {
  id: "user-1",
  firstName: "Mikko",
  lastName: "Mäkinen",
  email: "mikko.makinen@example.com",
  organization: "Peliryhmä X",
  registeredAt: "2023-01-15T10:30:00",
  lastLogin: "2023-11-18T14:25:00",
  status: "active",
};

const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  organization: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and numbers"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const UserDashboard = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["userBookings"],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      return getUserBookings(user.id, 1, 10);
    },
  });

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.user_metadata?.firstName || "",
      lastName: user?.user_metadata?.lastName || "",
      email: user?.email || "",
      organization: user?.user_metadata?.organization || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleCancelBooking = useCallback((bookingId: string) => {
    toast.success("Booking cancelled successfully");
  }, []);

  const onProfileSubmit = async (values: ProfileFormValues) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: values.email,
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          organization: values.organization,
        },
      });

      if (error) throw error;

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword,
      });

      if (error) throw error;

      toast.success("Password updated successfully");
      passwordForm.reset();
    } catch (error) {
      toast.error("Failed to update password", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const bookings = bookingsData?.data || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container-custom py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">User Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.user_metadata?.firstName || "User"}!
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-4 md:mt-0"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid grid-cols-3 md:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Info cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active bookings
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bookings.filter((b) => b.status === "approved").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +1 pending booking
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Next booking
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatDate(
                      bookings.find((b) => b.status === "approved")
                        ?.start_date || ""
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    3 items booked
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Membership status
                  </CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    Active
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Member since {new Date(user.created_at).getFullYear()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent bookings */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent bookings</h2>
                <Button
                  variant="link"
                  onClick={() => setActiveTab("bookings")}
                  className="text-sm text-illusia-purple"
                >
                  Show all
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="space-y-4">
                {bookings.slice(0, 3).map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getStatusIcon(booking.status)}
                          <div className="ml-3">
                            <p className="font-medium">
                              Booking #{booking.id.split("-")[1]}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(booking.start_date)} -{" "}
                              {formatDate(booking.end_date)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(booking.status)}
                          <p className="text-sm text-muted-foreground mt-1">
                            {booking.item?.name}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Bookings</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/40 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3">
                          {getStatusIcon(booking.status)}
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            Booking #{booking.id.split("-")[1]}
                          </CardTitle>
                          <CardDescription>
                            Created{" "}
                            {format(new Date(booking.created_at), "PPP")}
                          </CardDescription>
                        </div>
                      </div>
                      <div>{getStatusBadge(booking.status)}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="font-medium">
                          {format(new Date(booking.start_date), "PPP")} -{" "}
                          {format(new Date(booking.end_date), "PPP")}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">
                          Booking duration:{" "}
                          {(new Date(booking.end_date).getTime() -
                            new Date(booking.start_date).getTime()) /
                            (1000 * 60 * 60 * 24) +
                            1}{" "}
                          days
                        </span>
                      </div>
                    </div>

                    <h3 className="font-medium mb-2">Booked Items</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <li className="flex items-center">
                        <div className="h-12 w-12 bg-muted rounded flex-shrink-0 overflow-hidden">
                          <img
                            src="/placeholder.svg"
                            alt={booking.item?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{booking.item?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.item?.price_per_day} €/day
                          </p>
                        </div>
                      </li>
                    </ul>

                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{booking.item?.name}</h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(booking.start_date), "PPP")} -{" "}
                          {format(new Date(booking.end_date), "PPP")}
                        </p>
                      </div>
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
                    </div>
                    {booking.special_requests && (
                      <p className="mt-2 text-sm text-gray-600">
                        Special requests: {booking.special_requests}
                      </p>
                    )}

                    {booking.status === "pending" && (
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="outline"
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel booking
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">User Information</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Name</p>
                      <p className="font-medium">
                        {user.user_metadata?.firstName}{" "}
                        {user.user_metadata?.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Email
                      </p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Organization
                      </p>
                      <p className="font-medium">
                        {user.user_metadata?.organization}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Member since
                      </p>
                      <p className="font-medium">
                        {formatDate(user.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Information
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Password change</h2>
              <Card>
                <CardContent className="p-6">
                  <Form {...passwordForm}>
                    <form
                      onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm new password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end">
                        <Button type="submit">Change password</Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Account deletion</h2>
              <Card className="border-red-200">
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">
                    Account deletion will permanently delete all your user data
                    and booking history. This action cannot be undone.
                  </p>

                  <Button
                    variant="outline"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                    onClick={() =>
                      toast.error("This feature is disabled for demo purposes.")
                    }
                  >
                    Delete account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;
