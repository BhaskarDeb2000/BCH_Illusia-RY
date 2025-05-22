import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Items", href: "/items" },
    { name: "About", href: "/about" },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <header className="bg-white border-b">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-illusia-purple">
              Illusia Storage
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-gray-600 hover:text-illusia-purple transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-illusia-purple">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-4">
                      Shopping Cart
                    </h2>
                    {items.length === 0 ? (
                      <p className="text-muted-foreground">
                        Your cart is empty
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between py-2"
                          >
                            <div className="flex items-center space-x-2">
                              <img
                                src={item.imageUrl || "/placeholder.svg"}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.quantity} quantity
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {items.length > 0 && (
                    <div className="mt-6 border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium">Total Items</span>
                        <span className="font-bold">{totalItems}</span>
                      </div>
                      <Button
                        className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]"
                        onClick={() => navigate("/checkout")}
                      >
                        Proceed to Checkout
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {user ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/dashboard">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  className="bg-illusia-purple hover:bg-illusia-purple-dark"
                  asChild
                >
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Hamburger menu button for mobile only */}
          <div className="flex md:hidden items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-64 h-full bg-white shadow-lg flex flex-col p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-illusia-purple">
                Illusia Storage
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-4 mb-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-gray-700 text-lg font-medium hover:text-illusia-purple transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col space-y-2">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to="/dashboard">
                      <User className="h-5 w-5 mr-2" /> Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    className="bg-illusia-purple hover:bg-illusia-purple-dark"
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
