import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/lib/cart";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const isLoggedIn = false; // This will be replaced with auth state
  const { lang, setLang, t } = useTranslation();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const navLinks = [
    { name: t("common.home"), href: "/" },
    { name: t("common.items"), href: "/items" },
    { name: t("common.about"), href: "/about" },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
      return;
    }
    window.location.reload(); // Refresh the page to update the UI
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container-custom flex justify-between items-center py-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-illusia-purple-900">
            Illusia Storage
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-foreground hover:text-illusia-purple transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Language selection */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLang(lang === "en" ? "fi" : "en")}
              className="px-2 py-1 rounded border text-xs bg-muted hover:bg-illusia-purple/10 transition-colors"
              aria-label={t("common.language")}
            >
              {lang === "en" ? t("common.finnish") : t("common.english")}
            </button>
          </div>

          {/* Cart */}
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
            <SheetContent side="right" className="w-full sm:max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Shopping Cart</h2>
                {items.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearCart()}
                    className="text-red-500 hover:text-red-600"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-4 border rounded-lg"
                    >
                      <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <ShoppingCart className="h-8 w-8 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="font-medium">
                            €{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {items.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">€{totalPrice.toFixed(2)}</span>
                  </div>
                  <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]">
                    Proceed to Checkout
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>

          {isLoggedIn ? (
            <div className="space-x-2">
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
            <div className="space-x-2">
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

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          {/* Cart */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative mr-2">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-illusia-purple">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Shopping Cart</h2>
                {items.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearCart()}
                    className="text-red-500 hover:text-red-600"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-4 border rounded-lg"
                    >
                      <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <ShoppingCart className="h-8 w-8 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="font-medium">
                            €{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {items.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">€{totalPrice.toFixed(2)}</span>
                  </div>
                  <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]">
                    Proceed to Checkout
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>

          {/* Language button mobile */}
          <button
            onClick={() => setLang(lang === "en" ? "fi" : "en")}
            className="px-2 py-1 rounded border text-xs bg-muted ml-2"
            aria-label={t("common.language")}
          >
            {lang === "en" ? t("common.finnish") : t("common.english")}
          </button>
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

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fade-in">
          <nav className="container-custom py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-foreground hover:text-illusia-purple transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Button variant="outline" asChild>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button
                  className="bg-illusia-purple hover:bg-illusia-purple-dark"
                  asChild
                >
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
