
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import MemoryGame from "@/components/games/MemoryGame";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-illusia-highlight1 to-illusia-dark py-16 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 space-y-6">
              <h1 className="font-roboto-slab text-4xl md:text-5xl lg:text-6xl font-bold">
                Illusia ry Storage Booking Portal
              </h1>
              <p className="font-lato text-lg md:text-xl">
                The easiest way to book storage items for your games and events.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-illusia-highlight2 hover:bg-illusia-highlight2/90 text-white"
                  asChild
                >
                  <Link to="/items">Browse Items</Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white text-illusia-highlight1 hover:bg-white/90"
                  asChild
                >
                  <Link to="/register">Create Account</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
              <div className="bg-white rounded-lg shadow-xl p-6 animate-float">
                <img 
                  src="/placeholder.svg" 
                  alt="Illusia Storage" 
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* API Documentation */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="font-roboto-slab text-3xl text-illusia-highlight1 text-center mb-10">
            API Documentation
          </h2>
          
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="font-roboto-slab text-2xl text-illusia-font mb-4">Available Endpoints</h3>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
              <div className="border-l-4 border-illusia-highlight1 pl-4">
                <h4 className="font-roboto-slab text-lg mb-2">Authentication</h4>
                <ul className="font-lato space-y-2 text-sm text-gray-600">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/auth/register</code> - Register new user</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/auth/login</code> - Login</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/auth/me</code> - Get current user info</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-illusia-highlight2 pl-4">
                <h4 className="font-roboto-slab text-lg mb-2">Items</h4>
                <ul className="font-lato space-y-2 text-sm text-gray-600">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/items</code> - Get all items</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/items/:id</code> - Get item by ID</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/items</code> - Create new item (Admin)</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-roboto-slab text-lg mb-2">Bookings</h4>
                <ul className="font-lato space-y-2 text-sm text-gray-600">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/bookings</code> - Get all bookings (Admin)</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/bookings/me</code> - Get user's bookings</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/bookings</code> - Create booking</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                className="font-lato border-illusia-highlight1 text-illusia-highlight1 hover:bg-illusia-highlight1/10"
              >
                <Link to="/api-docs">View Full Documentation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Game Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="font-roboto-slab text-3xl text-illusia-highlight1 text-center mb-10">
            Test Your Memory
          </h2>
          <p className="font-lato text-center mb-8 max-w-2xl mx-auto">
            While you're here, why not take a break and play a quick memory game?
            Match all the pairs with as few moves as possible!
          </p>
          
          <MemoryGame />
        </div>
      </section>
      
      {/* Default Accounts */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="font-roboto-slab text-3xl text-illusia-highlight1 text-center mb-10">
            Default Accounts
          </h2>
          <p className="font-lato text-center mb-8">
            For testing purposes, the following accounts are available:
          </p>
          
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-illusia-highlight1">
              <h4 className="font-roboto-slab text-xl mb-3">Super Admin</h4>
              <div className="font-lato space-y-1">
                <p>Email: vera@illusia.fi</p>
                <p>Password: password123</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-illusia-highlight2">
              <h4 className="font-roboto-slab text-xl mb-3">Admin</h4>
              <div className="font-lato space-y-1">
                <p>Email: admin@illusia.fi</p>
                <p>Password: password123</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-gray-400">
              <h4 className="font-roboto-slab text-xl mb-3">Regular User</h4>
              <div className="font-lato space-y-1">
                <p>Email: user@example.com</p>
                <p>Password: password123</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
