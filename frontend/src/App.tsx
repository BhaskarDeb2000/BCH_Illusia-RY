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
import { I18nProvider } from "./i18n";
import Layout from "@/components/layout/Layout";
import { ProtectionItemGrid } from "./components/ProtectionItemGrid";

const queryClient = new QueryClient();

const sampleItems = [
  {
    id: "1",
    name: "Combat vests (IKEA bag)",
    description: "Combat vest x5, black (new model), with EL-straps",
    price: 39.29,
    quantity: 5,
    hasStorageBox: true,
  },
  {
    id: "2",
    name: "Combat vests (IKEA bag)",
    description:
      "Combat vest x5, black (old model) + combat vest x3, black (light), with EL-straps",
    price: 47.21,
    quantity: 8,
    hasStorageBox: true,
  },
  {
    id: "3",
    name: "Helmets",
    description: "Military helmet x6 black, large",
    price: 9.62,
    quantity: 6,
    hasStorageBox: true,
  },
  {
    id: "4",
    name: "Helmets",
    description: "Military helmet x6 black, 3 x large, 3 x medium",
    price: 57.93,
    quantity: 6,
    hasStorageBox: true,
  },
  {
    id: "5",
    name: "Helmets",
    description: "Military helmet x6 black, small + padding",
    price: 91.24,
    quantity: 6,
    hasStorageBox: true,
  },
  {
    id: "6",
    name: "Safety goggles/masks + straps",
    description:
      "Safety goggles/masks x17, EL-straps (2x3m, 3x2m), Molle-compatible phone holder",
    price: 18.36,
    quantity: 17,
    hasStorageBox: true,
  },
];

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <I18nProvider>
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
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/about" element={<About />} />
                <Route
                  path="/protection-items"
                  element={<ProtectionItemGrid items={sampleItems} />}
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </I18nProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
