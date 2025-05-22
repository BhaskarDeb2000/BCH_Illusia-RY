import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Items from "./pages/Items";
import ItemDetail from "./pages/ItemDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import Layout from "@/components/layout/Layout";
import { ProtectionItemGrid } from "./components/ProtectionItemGrid";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import AuthErrorBoundary from "./components/auth/AuthErrorBoundary";

const queryClient = new QueryClient();

const sampleItems = [
  {
    id: "2",
    name: "Kypäriä",
    description: "Sotilaskypärä x 6 musta, large",
    price: 2.5,
    quantity: 6,
    hasStorageBox: true,
    imageUrl:
      "https://schoolphotosbucket.s3.eu-north-1.amazonaws.com/Kyparia-6L.png",
  },
  {
    id: "3",
    name: "Kypäriä",
    description: "Sotilaskypärä x 6 musta, 3 x large, 3 x medium",
    price: 2.5,
    quantity: 6,
    hasStorageBox: true,
    imageUrl:
      "https://schoolphotosbucket.s3.eu-north-1.amazonaws.com/Kypa%CC%88ria%CC%88-3L%2C3M.png",
  },
  {
    id: "4",
    name: "Kypäriä",
    description: "Sotilaskypärä x 6 musta, small + pehmusteita",
    price: 2.5,
    quantity: 6,
    hasStorageBox: true,
    imageUrl:
      "https://schoolphotosbucket.s3.eu-north-1.amazonaws.com/Kypa%CC%88ria%CC%88-Sotilaskypa%CC%88ra%CC%88+x+6+musta%2Cpehmusteita.png",
  },
  {
    id: "5",
    name: "Taisteluliivejä (IKEA-kassi)",
    description: "Taisteluliivi x 5, musta (uusi malli), EL-nauhoilla",
    price: 3.0,
    quantity: 5,
    hasStorageBox: true,
    imageUrl:
      "https://schoolphotosbucket.s3.eu-north-1.amazonaws.com/Taisteluliiveja%CC%88+(IKEA-kassi).webp",
  },
  {
    id: "6",
    name: "Taisteluliivejä (IKEA-kassi)",
    description:
      "Taisteluliivi x 5, musta (vanha malli) + taisteluliivi x 3, musta (kevyt), EL-nauhoilla",
    price: 2.5,
    quantity: 8,
    hasStorageBox: true,
    imageUrl:
      "https://schoolphotosbucket.s3.eu-north-1.amazonaws.com/Taisteluliiveja%CC%88+(IKEA-kassi).webp",
  },
  {
    id: "7",
    name: "Taisteluliivejä (IKEA-kassi)",
    description: "Taisteluliivi x 5, musta (uusi malli), EL-nauhoilla",
    price: 3.0,
    quantity: 5,
    hasStorageBox: true,
    imageUrl:
      "https://schoolphotosbucket.s3.eu-north-1.amazonaws.com/Taisteluliiveja%CC%88+(IKEA-kassi).webp",
  },
  {
    id: "8",
    name: "Suojalaseja/-maskeja + varusteita",
    description:
      "Suojalasit/-maski x 17, EL-nauhaa (2x3m, 3x2m), Molle-kiinnitteinen kännykkäpidike",
    price: 1.5,
    quantity: 17,
    hasStorageBox: true,
    imageUrl:
      "https://schoolphotosbucket.s3.eu-north-1.amazonaws.com/Suojalaseja%3A-maskeja+%2B+varusteita.png",
  },
];

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthErrorBoundary>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/items" element={<Items />} />
                <Route path="/items/:id" element={<ItemDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/about" element={<About />} />
                <Route
                  path="/protection-items"
                  element={
                    <ProtectedRoute>
                      <ProtectionItemGrid items={sampleItems} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </AuthErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
