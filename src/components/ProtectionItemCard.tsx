import { Box, ShieldCheck, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/cart";
import { toast } from "sonner";
import { useState } from "react";

interface ProtectionItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  hasStorageBox?: boolean;
  imageUrl?: string;
}

export function ProtectionItemCard({
  id,
  name,
  description,
  price,
  quantity: availableQuantity,
  hasStorageBox = false,
  imageUrl,
}: ProtectionItemProps) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const handleDetailsClick = () => {
    navigate(`/items/${id}`);
  };

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      description,
      price,
      quantity: selectedQuantity,
      imageUrl,
    });

    toast.success("Added to cart", {
      description: `${name} (${selectedQuantity} pcs) has been added to your cart.`,
    });
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(
      1,
      Math.min(availableQuantity, selectedQuantity + change)
    );
    setSelectedQuantity(newQuantity);
  };

  return (
    <Card className="group flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
      <CardHeader className="relative pb-0 space-y-0">
        <Badge
          variant="secondary"
          className="absolute top-3 right-3 bg-[#7C3AED] text-white font-medium px-3 py-1 z-10 shadow-sm"
        >
          Protection
        </Badge>
        <div className="w-full aspect-square bg-gray-50 rounded-t-xl flex items-center justify-center overflow-hidden group-hover:bg-gray-100 transition-colors duration-200">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <ShieldCheck className="w-12 h-12 text-gray-300" />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">
              €{price.toFixed(2)}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#7C3AED] font-medium">
                {availableQuantity} pcs
              </span>
              {hasStorageBox && (
                <div className="flex items-center text-gray-500">
                  <Box className="w-3.5 h-3.5 mr-1 stroke-[1.5]" />
                  <span className="text-xs">Storage box</span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <h3 className="font-medium text-gray-900 line-clamp-1">{name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-3 p-5 pt-0">
        <Button
          variant="outline"
          className="w-full text-gray-600 hover:text-gray-900 border-gray-200 bg-white hover:bg-gray-50"
          onClick={handleDetailsClick}
        >
          Details
        </Button>
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 hover:bg-gray-50"
              onClick={() => handleQuantityChange(-1)}
              disabled={selectedQuantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">
              {selectedQuantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 hover:bg-gray-50"
              onClick={() => handleQuantityChange(1)}
              disabled={selectedQuantity >= availableQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-sm hover:shadow-md transition-all duration-200"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
