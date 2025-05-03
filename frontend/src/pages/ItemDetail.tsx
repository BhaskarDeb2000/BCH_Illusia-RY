import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Check,
  MapPin,
  Tag,
  Info,
  Box,
  ShieldCheck,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import CartDrawer from "@/components/cart/CartDrawer";
import { useCartStore } from "@/lib/cart";

interface ItemDetails {
  color: string;
  material: string;
  size: string;
  features: string[];
  storageNotes: string;
  condition: string;
  lastChecked: string;
}

interface ProtectionItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  hasStorageBox: boolean;
  imageUrl?: string;
  details: ItemDetails;
}

// Mock data for protection items
const getProtectionItemById = (id: string): ProtectionItem | undefined => {
  const items: ProtectionItem[] = [
    {
      id: "1",
      name: "Combat vests (IKEA bag)",
      description: "Combat vest x5, black (new model), with EL-straps",
      price: 39.29,
      quantity: 5,
      hasStorageBox: true,
      details: {
        color: "Black",
        material: "Ballistic nylon",
        size: "Universal fit",
        features: [
          "New model design",
          "EL-straps included",
          "Adjustable sizing",
          "Multiple pouches",
        ],
        storageNotes: "Stored in IKEA bag for protection",
        condition: "New",
        lastChecked: "2024-03-15",
      },
    },
    {
      id: "2",
      name: "Combat vests (IKEA bag)",
      description:
        "Combat vest x5, black (old model) + combat vest x3, black (light), with EL-straps",
      price: 47.21,
      quantity: 8,
      hasStorageBox: true,
      details: {
        color: "Black",
        material: "Ballistic nylon",
        size: "Universal fit",
        features: [
          "Mixed old and light models",
          "EL-straps included",
          "Adjustable sizing",
        ],
        storageNotes: "Stored in IKEA bag for protection",
        condition: "Good",
        lastChecked: "2024-03-15",
      },
    },
    {
      id: "3",
      name: "Helmets",
      description: "Military helmet x6 black, large",
      price: 9.62,
      quantity: 6,
      hasStorageBox: true,
      details: {
        color: "Black",
        size: "Large",
        material: "High-impact plastic",
        features: [
          "Adjustable straps",
          "Padding included",
          "Ventilation system",
        ],
        storageNotes: "Stored in protective box",
        condition: "Excellent",
        lastChecked: "2024-03-15",
      },
    },
    {
      id: "4",
      name: "Helmets",
      description: "Military helmet x6 black, 3 x large, 3 x medium",
      price: 57.93,
      quantity: 6,
      hasStorageBox: true,
      details: {
        color: "Black",
        size: "Mixed (3 Large, 3 Medium)",
        material: "High-impact plastic",
        features: [
          "Adjustable straps",
          "Padding included",
          "Ventilation system",
          "Size-specific padding",
        ],
        storageNotes: "Stored in protective box with size labels",
        condition: "Excellent",
        lastChecked: "2024-03-15",
      },
    },
    {
      id: "5",
      name: "Helmets",
      description: "Military helmet x6 black, small + padding",
      price: 91.24,
      quantity: 6,
      hasStorageBox: true,
      details: {
        color: "Black",
        size: "Small",
        material: "High-impact plastic",
        features: [
          "Adjustable straps",
          "Extra padding included",
          "Ventilation system",
          "Size-specific padding",
        ],
        storageNotes: "Stored in protective box with extra padding",
        condition: "Excellent",
        lastChecked: "2024-03-15",
      },
    },
    {
      id: "6",
      name: "Safety goggles/masks + straps",
      description:
        "Safety goggles/masks x17, EL-straps (2x3m, 3x2m), Molle-compatible phone holder",
      price: 18.36,
      quantity: 17,
      hasStorageBox: true,
      details: {
        color: "Clear/Black",
        material: "Polycarbonate/Elastic",
        size: "One size fits all",
        features: [
          "Anti-fog coating",
          "UV protection",
          "Adjustable straps",
          "Molle-compatible phone holder",
          "EL-straps included (2x3m, 3x2m)",
        ],
        storageNotes: "Stored in protective case with individual compartments",
        condition: "New",
        lastChecked: "2024-03-15",
      },
    },
  ];
  return items.find((item) => item.id === id);
};

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  // In a real app, you would fetch this data from your API
  const item = id ? getProtectionItemById(id) : null;

  if (!item) {
    return (
      <main className="flex-grow">
        <div className="container mx-auto py-8">
          <div className="flex items-center mb-6">
            <Link
              to="/items"
              className="text-muted-foreground hover:text-foreground flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Items
            </Link>
          </div>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Item not found</h1>
            <p className="text-muted-foreground mb-6">
              The item you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/items">Browse Items</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    if (item) {
      addItem({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: quantity,
        imageUrl: item.imageUrl,
      });

      setIsAdded(true);
      toast.success("Added to cart", {
        description: `${item.name} (${quantity} pcs) has been added to your cart.`,
      });

      // Reset the added state after 1.5 seconds
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= item.quantity) {
      setQuantity(value);
    }
  };

  return (
    <main className="flex-grow">
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Link
            to="/items"
            className="text-muted-foreground hover:text-foreground flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Items
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            <div className="relative aspect-square">
              <Badge
                variant="secondary"
                className="absolute top-4 right-4 bg-[#7C3AED] bg-opacity-90 text-white font-medium px-3 py-1 z-10"
              >
                Protection
              </Badge>
              <div className="w-full h-full flex items-center justify-center">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <ShieldCheck className="w-24 h-24 text-gray-300" />
                )}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
              <p className="text-xl font-bold text-gray-900 mb-4">
                €{item.price.toFixed(2)}
              </p>
              <p className="text-gray-600 mb-4">{item.description}</p>

              <div className="flex items-center gap-3 text-sm">
                <span className="text-[#7C3AED] font-medium">
                  {item.quantity} pcs
                </span>
                {item.hasStorageBox && (
                  <div className="flex items-center text-gray-500">
                    <Box className="w-3.5 h-3.5 mr-1 stroke-[1.5]" />
                    Storage box
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Additional Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Color</p>
                  <p>{item.details.color}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Material</p>
                  <p>{item.details.material}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Size</p>
                  <p>{item.details.size}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Condition</p>
                  <p>{item.details.condition}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Features</p>
                <ul className="list-disc list-inside space-y-1">
                  {item.details.features.map((feature, index) => (
                    <li key={index} className="text-gray-600">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {item.details.storageNotes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Storage Notes</p>
                  <p className="text-gray-600">{item.details.storageNotes}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full text-gray-600 hover:text-gray-900 border-gray-200 bg-white"
              >
                Details
              </Button>
              <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
