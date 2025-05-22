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
  quantity: number;
  hasStorageBox?: boolean;
  imageUrl?: string;
}

export function ProtectionItemCard({
  id,
  name,
  description,
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
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover"
        />
        {hasStorageBox && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-illusia-purple text-white">Storage Box</Badge>
          </div>
        )}
      </div>

      <CardHeader>
        <h3 className="font-medium text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </Button>
              <span className="w-8 text-center">{selectedQuantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <div className="text-center text-sm font-medium text-gray-600">
          Total Items: {selectedQuantity}
        </div>
        <Button
          className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-sm hover:shadow-md transition-all duration-200"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
