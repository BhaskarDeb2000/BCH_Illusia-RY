import { useState } from "react";
import { ItemList } from "@/components/items/ItemList";
import { ItemDialog } from "@/components/items/ItemDialog";
import { ProtectionItemGrid } from "@/components/ProtectionItemGrid";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

const sampleItems = [
  {
    id: "2",
    name: "Kypäriä",
    description: "Sotilaskypärä x 6 musta, large",
    price: 2.5,
    quantity: 6,
    hasStorageBox: true,
    imageUrl:
      "https://schoolphotosbucket.s3.eu-north-1.amazonaws.com/Kyparia-6L.png",
  },
  {
    id: "3",
    name: "Kypäriä",
    description: "Sotilaskypärä x 6 musta, 3 x large, 3 x medium",
    price: 2.5,
    quantity: 6,
    hasStorageBox: true,
    imageUrl:
      "https://schoolphotosbucket.s3.eu-north-1.amazonaws.com/Kypa%CC%88ria%CC%88-3L%2C3M.png",
  },
  {
    id: "4",
    name: "Kypäriä",
    description: "Sotilaskypärä x 6 musta, small + pehmusteita",
    price: 2.5,
    quantity: 6,
    hasStorageBox: true,
    imageUrl:
      "https://schoolphotosbucket.s3.eu-north-1.amazonaws.com/Kypa%CC%88ria%CC%88-Sotilaskypa%CC%88ra%CC%88+x+6+musta%2Cpehmusteita.png",
  },
  {
    id: "5",
    name: "Taisteluliivejä (IKEA-kassi)",
    description: "Taisteluliivi x 5, musta (uusi malli), EL-nauhoilla",
    price: 3.0,
    quantity: 5,
    hasStorageBox: true,
    imageUrl:
      "https://schoolphotosbucket.s3.eu-north-1.amazonaws.com/Taisteluliiveja%CC%88+(IKEA-kassi).webp",
  },
  {
    id: "6",
    name: "Taisteluliivejä (IKEA-kassi)",
    description:
      "Taisteluliivi x 5, musta (vanha malli) + taisteluliivi x 3, musta (kevyt), EL-nauhoilla",
    price: 2.5,
    quantity: 8,
    hasStorageBox: true,
    imageUrl:
      "https://schoolphotosbucket.s3.eu-north-1.amazonaws.com/Taisteluliiveja%CC%88+(IKEA-kassi).webp",
  },
  {
    id: "7",
    name: "Taisteluliivejä (IKEA-kassi)",
    description: "Taisteluliivi x 5, musta (uusi malli), EL-nauhoilla",
    price: 3.0,
    quantity: 5,
    hasStorageBox: true,
    imageUrl:
      "https://schoolphotosbucket.s3.eu-north-1.amazonaws.com/Taisteluliiveja%CC%88+(IKEA-kassi).webp",
  },
  {
    id: "8",
    name: "Suojalaseja/-maskeja + varusteita",
    description:
      "Suojalasit/-maski x 17, EL-nauhaa (2x3m, 3x2m), Molle-kiinnitteinen kännykkäpidike",
    price: 1.5,
    quantity: 17,
    hasStorageBox: true,
    imageUrl:
      "https://schoolphotosbucket.s3.eu-north-1.amazonaws.com/Suojalaseja%3A-maskeja+%2B+varusteita.png",
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
