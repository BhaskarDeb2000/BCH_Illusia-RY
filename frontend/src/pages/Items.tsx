import { useState } from "react";
import { ItemList } from "@/components/items/ItemList";
import { ItemDialog } from "@/components/items/ItemDialog";
import ItemGrid from "@/components/items/ItemGrid";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { useItems } from "@/hooks/useItems";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function ItemsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { items, isLoading, error, handleFilterChange } = useItems();

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Items</h1>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      <ErrorBoundary>
        {viewMode === "grid" ? (
          <ItemGrid items={items} isLoading={isLoading} />
        ) : (
          <ItemList
            items={items}
            isLoading={isLoading}
            onFilterChange={handleFilterChange}
          />
        )}
      </ErrorBoundary>

      <div className="fixed bottom-6 right-6">
        <ItemDialog />
      </div>
    </div>
  );
}
