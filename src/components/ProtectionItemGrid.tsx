import { ProtectionItemCard } from "./ProtectionItemCard";

interface ProtectionItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  hasStorageBox: boolean;
  imageUrl?: string;
}

interface ProtectionItemGridProps {
  items: ProtectionItem[];
}

export function ProtectionItemGrid({ items }: ProtectionItemGridProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
          {items.map((item) => (
            <ProtectionItemCard
              key={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              quantity={item.quantity}
              hasStorageBox={item.hasStorageBox}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
