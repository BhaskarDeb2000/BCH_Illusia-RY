import { useEffect, useState } from "react";
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
  Clock,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/lib/cart";
import { getItem } from "@/lib/api/items";
import { Item } from "@/types/item";

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchItem() {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await getItem(id);
        setItem(data);
      } catch (err) {
        setItem(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  if (isLoading) {
    return (
      <main className="flex-grow">
        <div className="container mx-auto py-8 text-center">
          <p>Loading item details...</p>
        </div>
      </main>
    );
  }

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
        name:
          item.name?.en ||
          item.description?.en ||
          item.number ||
          item.id ||
          "Unnamed Item",
        description: item.description?.en || "",
        quantity: quantity,
        imageUrl: item.imageUrl,
        maxQuantity: item.quantity,
        price: item.price,
        category: item.category,
      });

      setIsAdded(true);
      toast.success("Added to cart", {
        description: `${
          item.name?.en ||
          item.description?.en ||
          item.number ||
          item.id ||
          "Unnamed Item"
        } (${quantity} pcs) has been added to your cart.`,
      });

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
                {item.category}
              </Badge>
              <div className="w-full h-full flex items-center justify-center">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name?.en || ""}
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
              <h1 className="text-3xl font-bold mb-2">
                {item.name?.en ||
                  item.description?.en ||
                  item.number ||
                  item.id ||
                  "Unnamed Item"}
              </h1>
              {item.price !== undefined && (
                <p className="text-xl font-bold text-gray-900 mb-4">
                  €{item.price.toFixed(2)} / hour
                </p>
              )}
              <p className="text-gray-600 mb-4">{item.description?.en || ""}</p>

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
                {item.storageLocation && (
                  <div className="flex items-center text-gray-500">
                    <MapPin className="w-3.5 h-3.5 mr-1 stroke-[1.5]" />
                    {item.storageLocation}
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
                  <p className="text-sm text-gray-500">Storage Details</p>
                  <p>{item.storageDetails?.en || ""}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : ""}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Updated At</p>
                  <p>
                    {item.updatedAt
                      ? new Date(item.updatedAt).toLocaleString()
                      : ""}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p>{item.category}</p>
                </div>
              </div>

              {item.tags && item.tags.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Booking Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Booking Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={item.quantity}
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(Number(e.target.value))
                      }
                      className="w-16 text-center"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= item.quantity}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Price:</span>
                  <span className="text-xl font-bold text-[#7C3AED]">
                    €
                    {item.price !== undefined
                      ? (item.price * quantity).toFixed(2)
                      : "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full text-gray-600 hover:text-gray-900 border-gray-200 bg-white"
              >
                Details
              </Button>
              <Button
                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
