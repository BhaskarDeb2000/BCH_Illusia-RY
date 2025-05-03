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

// Mock data for user bookings
const bookings = [
  {
    id: "booking-1",
    status: "pending",
    startDate: "2023-11-20",
    endDate: "2023-11-22",
    items: [
      {
        id: "1",
        name: "Patjat (20kpl)",
        quantity: 10,
        imageUrl: "/placeholder.svg",
      },
      {
        id: "2",
        name: "Ensiapulaukku",
        quantity: 1,
        imageUrl: "/placeholder.svg",
      },
    ],
    createdAt: "2023-11-15T12:30:00",
  },
  {
    id: "booking-2",
    status: "approved",
    startDate: "2023-12-05",
    endDate: "2023-12-12",
    items: [
      {
        id: "3",
        name: "LED-valaisimet",
        quantity: 5,
        imageUrl: "/placeholder.svg",
      },
      {
        id: "4",
        name: "Pöytä, kokoontaitettava",
        quantity: 2,
        imageUrl: "/placeholder.svg",
      },
      {
        id: "5",
        name: "Tuoleja (10kpl)",
        quantity: 20,
        imageUrl: "/placeholder.svg",
      },
    ],
    createdAt: "2023-11-10T09:15:00",
  },
  {
    id: "booking-3",
    status: "rejected",
    startDate: "2023-10-15",
    endDate: "2023-10-18",
    items: [
      {
        id: "6",
        name: "Keskiaikaiset asut",
        quantity: 3,
        imageUrl: "/placeholder.svg",
      },
    ],
    rejectionReason: "Tarvikkeita ei ole saatavilla valittuna ajankohtana",
    createdAt: "2023-10-01T14:45:00",
  },
  {
    id: "booking-4",
    status: "completed",
    startDate: "2023-09-10",
    endDate: "2023-09-15",
    items: [
      {
        id: "7",
        name: "Nopat (eri kokoja)",
        quantity: 5,
        imageUrl: "/placeholder.svg",
      },
      {
        id: "8",
        name: "Pöytäpelimatot",
        quantity: 2,
        imageUrl: "/placeholder.svg",
      },
    ],
    createdAt: "2023-08-25T11:20:00",
  },
];

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

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleCancelBooking = useCallback((bookingId: string) => {
    toast.success("Varaus peruutettu", {
      description: "Varauspyyntö on peruutettu onnistuneesti.",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container-custom py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Käyttäjäpaneeli</h1>
            <p className="text-muted-foreground">
              Tervetuloa takaisin, {user.firstName}!
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-4 md:mt-0"
            onClick={() => toast.info("Kirjautuminen ulos...")}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Kirjaudu ulos
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid grid-cols-3 md:w-[400px]">
            <TabsTrigger value="overview">Yhteenveto</TabsTrigger>
            <TabsTrigger value="bookings">Varaukset</TabsTrigger>
            <TabsTrigger value="profile">Profiili</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Info cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Aktiiviset varaukset
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bookings.filter((b) => b.status === "approved").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +1 odottava varaus
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Seuraava varaus
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatDate(
                      bookings.find((b) => b.status === "approved")
                        ?.startDate || ""
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    3 tarviketta varattu
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Jäsenyyden tila
                  </CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    Aktiivinen
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Jäsen vuodesta {new Date(user.registeredAt).getFullYear()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent bookings */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Viimeisimmät varaukset
                </h2>
                <Button
                  variant="link"
                  onClick={() => setActiveTab("bookings")}
                  className="text-sm text-illusia-purple"
                >
                  Näytä kaikki
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
                              Varaus #{booking.id.split("-")[1]}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(booking.startDate)} -{" "}
                              {formatDate(booking.endDate)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(booking.status)}
                          <p className="text-sm text-muted-foreground mt-1">
                            {booking.items.length} tarviketta
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
              <h2 className="text-xl font-semibold">Kaikki varaukset</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Suodata
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
                            Varaus #{booking.id.split("-")[1]}
                          </CardTitle>
                          <CardDescription>
                            Luotu{" "}
                            {format(
                              new Date(booking.createdAt),
                              "dd.MM.yyyy HH:mm",
                              { locale: fi }
                            )}
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
                          {formatDate(booking.startDate)} -{" "}
                          {formatDate(booking.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">
                          Varauksen kesto:{" "}
                          {(new Date(booking.endDate).getTime() -
                            new Date(booking.startDate).getTime()) /
                            (1000 * 60 * 60 * 24) +
                            1}{" "}
                          päivää
                        </span>
                      </div>
                    </div>

                    <h3 className="font-medium mb-2">Varatut tarvikkeet</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {booking.items.map((item) => (
                        <li key={item.id} className="flex items-center">
                          <div className="h-12 w-12 bg-muted rounded flex-shrink-0 overflow-hidden">
                            <img
                              src={item.imageUrl || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} kpl
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {booking.rejectionReason && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm font-medium text-red-800">
                          Hylkäyksen syy:
                        </p>
                        <p className="text-sm text-red-700">
                          {booking.rejectionReason}
                        </p>
                      </div>
                    )}

                    {booking.status === "pending" && (
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="outline"
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Peruuta varaus
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
              <h2 className="text-xl font-semibold mb-4">Käyttäjätiedot</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Nimi</p>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Sähköposti
                      </p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Organisaatio
                      </p>
                      <p className="font-medium">{user.organization}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Jäsen alkaen
                      </p>
                      <p className="font-medium">
                        {formatDate(user.registeredAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button>
                      <Settings className="h-4 w-4 mr-2" />
                      Muokkaa tietoja
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">
                Salasanan vaihtaminen
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="current-password"
                        className="block text-sm font-medium mb-1"
                      >
                        Nykyinen salasana
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        className="w-full p-2 border rounded-md"
                        placeholder="********"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="new-password"
                        className="block text-sm font-medium mb-1"
                      >
                        Uusi salasana
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        className="w-full p-2 border rounded-md"
                        placeholder="********"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="block text-sm font-medium mb-1"
                      >
                        Vahvista uusi salasana
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        className="w-full p-2 border rounded-md"
                        placeholder="********"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button>Vaihda salasana</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Tilin poistaminen</h2>
              <Card className="border-red-200">
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">
                    Tilin poistaminen poistaa kaikki käyttäjätietosi ja
                    varaushistoriasi pysyvästi. Tätä toimintoa ei voi peruuttaa.
                  </p>

                  <Button
                    variant="outline"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                    onClick={() =>
                      toast.error(
                        "Tämä toiminto on poistettu käytöstä demoa varten."
                      )
                    }
                  >
                    Poista tilini
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
