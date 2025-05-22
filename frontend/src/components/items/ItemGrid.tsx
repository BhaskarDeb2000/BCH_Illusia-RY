import { useState } from "react";
import ItemCard from "../ui/ItemCard";
import { Button } from "@/components/ui/button";
import { Item } from "@/types/item";

interface ItemGridProps {
  items: Item[];
  isLoading?: boolean;
}

export default function ItemGrid({ items, isLoading }: ItemGridProps) {
  const [displayLimit, setDisplayLimit] = useState(12);

  const handleLoadMore = () => {
    setDisplayLimit((prevLimit) => prevLimit + 12);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-md mb-2"></div>
            <div className="bg-gray-200 h-5 rounded-md w-3/4 mb-2"></div>
            <div className="bg-gray-200 h-4 rounded-md w-full mb-1"></div>
            <div className="bg-gray-200 h-4 rounded-md w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <h3 className="text-xl font-medium mb-2">Not Available</h3>
        <p className="text-muted-foreground">No items found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.slice(0, displayLimit).map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {items.length > displayLimit && (
        <div className="flex justify-center mt-8">
          <Button variant="secondary" onClick={handleLoadMore}>
            Load More Items
          </Button>
        </div>
      )}
    </div>
  );
}
