import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Info, Check, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Item } from "@/types/item";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/lib/cart";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Login Required", {
        description: "Please login to add items to your cart",
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    try {
      setIsLoading(true);
      await addItem({
        id: item.id,
        name:
          item.name?.en ||
          item.description?.en ||
          item.number ||
          item.id ||
          "Unnamed Item",
        description: item.description?.en || "",
        quantity: 1,
        maxQuantity: item.quantity,
        imageUrl: item.imageUrl,
        category: item.category,
      });

      setIsAdded(true);
      toast.success("Add", {
        description: `${
          item.name?.en ||
          item.description?.en ||
          item.number ||
          item.id ||
          "Unnamed Item"
        } Add Cart.`,
        action: {
          label: "View Cart",
          onClick: () => navigate("/cart"),
        },
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  return (
    <ErrorBoundary>
      <Card className="overflow-hidden card-hover h-full flex flex-col">
        <div className="relative aspect-square">
          <img
            src={item.imageUrl || "/placeholder.svg"}
            alt={
              item.name?.en ||
              item.description?.en ||
              item.number ||
              item.id ||
              "Unnamed Item"
            }
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          {item.quantity <= 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge className="bg-destructive text-white text-lg font-medium px-3 py-1.5">
                Out of Stock
              </Badge>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge className="bg-illusia-purple text-white">
              {item.category}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg line-clamp-1">
              {item.name?.en ||
                item.description?.en ||
                item.number ||
                item.id ||
                "Unnamed Item"}
            </h3>
            <span className="text-sm text-muted-foreground">
              {item.quantity > 0 ? `${item.quantity} pcs` : "Out of Stock"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pb-2 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {item.description?.en || ""}
          </p>
          <div className="flex flex-wrap gap-1 mb-2">
            {item.tags && item.tags.length > 0 ? (
              <>
                {item.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{item.tags.length - 3}
                  </Badge>
                )}
              </>
            ) : null}
          </div>

          <div className="space-y-1 mt-2">
            {item.storageDetails?.en && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Package className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="line-clamp-1">
                  {item.storageDetails?.en || ""}
                </span>
              </div>
            )}

            {item.storageLocation && (
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="line-clamp-1">{item.storageLocation}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-2 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link to={`/items/${item.id}`}>
              <Info className="h-4 w-4 mr-1" />
              Details
            </Link>
          </Button>
          <Button
            size="sm"
            className={`flex-1 ${
              isAdded
                ? "bg-green-600 hover:bg-green-700"
                : "bg-illusia-purple hover:bg-illusia-purple-dark"
            }`}
            disabled={item.quantity <= 0 || isAdded || isLoading}
            onClick={handleAddToCart}
          >
            {isAdded ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Add
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-1" />
                {item.quantity > 0 ? "Add" : "Out of Stock"}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </ErrorBoundary>
  );
};

export default ItemCard;
