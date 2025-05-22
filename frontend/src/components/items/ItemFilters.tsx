import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";

interface ItemFiltersProps {
  onSearch: (query: string) => void;
  onFilter: (filters: ItemFilters) => void;
  onSort: (sortBy: string, direction: "asc" | "desc") => void;
  categories: string[];
  locations: string[];
}

export interface ItemFilters {
  category?: string;
  location?: string;
  availability?: "all" | "available" | "unavailable";
  priceRange?: {
    min?: number;
    max?: number;
  };
  tags?: string[];
}

export function ItemFilters({
  onSearch,
  onFilter,
  onSort,
  categories,
  locations,
}: ItemFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ItemFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = <K extends keyof ItemFilters>(
    key: K,
    value: ItemFilters[K]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleSort = (value: string) => {
    const [field, direction] = value.split("-");
    onSort(field, direction as "asc" | "desc");
  };

  const clearFilters = () => {
    setFilters({});
    onFilter({});
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Search items"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg">
          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Location</label>
            <Select
              value={filters.location}
              onValueChange={(value) => handleFilterChange("location", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Availability
            </label>
            <Select
              value={filters.availability}
              onValueChange={(value) =>
                handleFilterChange(
                  "availability",
                  value as ItemFilters["availability"]
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Not Available</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Sort By</label>
            <Select onValueChange={handleSort}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (Ascending)</SelectItem>
                <SelectItem value="name-desc">Name (Descending)</SelectItem>
                <SelectItem value="price-asc">Price (Ascending)</SelectItem>
                <SelectItem value="price-desc">Price (Descending)</SelectItem>
                <SelectItem value="quantity-asc">
                  Quantity (Ascending)
                </SelectItem>
                <SelectItem value="quantity-desc">
                  Quantity (Descending)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-full flex justify-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
