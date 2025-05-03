import { useState } from "react";
import { ItemList } from "@/components/items/ItemList";
import { ItemDialog } from "@/components/items/ItemDialog";
import { ProtectionItemGrid } from "@/components/ProtectionItemGrid";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

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

export default function ItemsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

      {viewMode === "grid" ? (
        <ProtectionItemGrid items={sampleItems} />
      ) : (
        <ItemList />
      )}

      <div className="fixed bottom-6 right-6">
        <ItemDialog />
      </div>
    </div>
  );
}
