import { useNavigate } from "react-router-dom";
import { Search, Package, Calendar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Package className="h-8 w-8 text-illusia-purple" />,
      title: "Wide Selection",
      description: "Hundreds of items for games and events.",
    },
    {
      icon: <Calendar className="h-8 w-8 text-illusia-purple" />,
      title: "Easy Booking",
      description: "Choose items, select dates, and send a booking request.",
    },
    {
      icon: <Search className="h-8 w-8 text-illusia-purple" />,
      title: "Quick Search",
      description: "Find the items you need using categories and tags.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-illusia-purple" />,
      title: "Reliable",
      description: "Illusia's official system ensures smooth bookings.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-b from-white to-illusia-gray-light py-16 md:py-24">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-illusia-purple-900">
                  Illusia Storage System
                </h1>
                <p className="text-lg md:text-xl mb-6 text-muted-foreground">
                  Book equipment for gaming and events easily and quickly.
                  Browse our comprehensive inventory and make reservations
                  directly online.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-illusia-purple hover:bg-illusia-purple-dark"
                    onClick={() => navigate("/items")}
                  >
                    Browse Items
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block bg-white p-6 rounded-lg shadow-lg">
                <img
                  src="/placeholder.svg"
                  alt="Illusia Storage"
                  className="w-full h-auto rounded-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-16">
          <div className="container-custom">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="card-hover border-none shadow-md">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-illusia-purple/10 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-medium mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular categories */}
        <section className="py-16 bg-illusia-gray-light">
          <div className="container-custom">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Popular Categories
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                "Game Supplies",
                "Props",
                "Furniture",
                "First Aid",
                "Lighting",
              ].map((category, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto py-8 flex flex-col items-center justify-center card-hover bg-white shadow-sm"
                  onClick={() => navigate("/items")}
                >
                  <span className="text-lg font-medium">{category}</span>
                </Button>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button
                size="lg"
                className="bg-illusia-purple hover:bg-illusia-purple-dark"
                onClick={() => navigate("/items")}
              >
                Show All Categories
              </Button>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-16 md:py-24 bg-illusia-purple-900 text-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg md:text-xl mb-8 text-gray-300">
                Register with the system and start booking items for games and
                events today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-illusia-purple hover:bg-illusia-purple-dark text-white border-none"
                  onClick={() => navigate("/items")}
                >
                  Browse Items
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
