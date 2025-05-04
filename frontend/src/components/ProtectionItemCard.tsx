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
  const [selectedHours, setSelectedHours] = useState(1);

  const handleDetailsClick = () => {
    navigate(`/items/${id}`);
  };

  const handleAddToCart = () => {
    const totalPrice = price * selectedHours;
    addItem({
      id,
      name,
      description,
      price: totalPrice,
      quantity: selectedQuantity,
      hours: selectedHours,
      imageUrl,
    });

    toast.success("Added to cart", {
      description: `${name} (${selectedQuantity} pcs) for ${selectedHours} hours has been added to your cart.`,
    });
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(
      1,
      Math.min(availableQuantity, selectedQuantity + change)
    );
    setSelectedQuantity(newQuantity);
  };

  const handleHoursChange = (change: number) => {
    const newHours = Math.max(1, selectedHours + change);
    setSelectedHours(newHours);
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Badge
          variant="secondary"
          className="absolute top-4 right-4 bg-[#7C3AED] bg-opacity-90 text-white font-medium px-3 py-1 z-10"
        >
          Protection
        </Badge>
        <div className="w-full h-full flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-contain"
            />
          ) : (
            <ShieldCheck className="w-24 h-24 text-gray-300" />
          )}
        </div>
      </div>

      <CardHeader className="pb-2">
        <h3 className="font-medium text-lg line-clamp-1">{name}</h3>
        <p className="text-xl font-bold text-gray-900">
          €{price.toFixed(2)}/hour
        </p>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[#7C3AED] font-medium">
            {availableQuantity} pcs
          </span>
          {hasStorageBox && (
            <div className="flex items-center text-gray-500">
              <Box className="w-3.5 h-3.5 mr-1 stroke-[1.5]" />
              Storage box
            </div>
          )}
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
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 hover:bg-gray-50"
              onClick={() => handleHoursChange(-1)}
              disabled={selectedHours <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">
              {selectedHours}h
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 hover:bg-gray-50"
              onClick={() => handleHoursChange(1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center text-sm font-medium text-gray-600">
            Total: €{(price * selectedHours * selectedQuantity).toFixed(2)}
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
