import { useState, useEffect } from 'react';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { FilterOption, FilterState } from '@/models/Item';
import { useTranslation } from '@/i18n';

interface ItemFiltersProps {
  categories: FilterOption[];
  tags: FilterOption[];
  onFilterChange: (filters: FilterState) => void;
}

const ItemFilters = ({ categories, tags, onFilterChange }: ItemFiltersProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    tags: [],
    availability: 'all',
    sortBy: 'name',
  });

  const [activeFilterCount, setActiveFilterCount] = useState(0);

  useEffect(() => {
    const count = 
      (filters.category ? 1 : 0) +
      filters.tags.length +
      (filters.availability !== 'all' ? 1 : 0);
    
    setActiveFilterCount(count);
    
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setFilters({ ...filters, category: value });
  };

  const handleAvailabilityChange = (value: string) => {
    setFilters({ 
      ...filters, 
      availability: value as 'all' | 'available' | 'unavailable'
    });
  };

  const handleSortChange = (value: string) => {
    setFilters({ 
      ...filters, 
      sortBy: value as 'name' | 'newest' | 'quantity'
    });
  };

  const toggleTag = (tagValue: string) => {
    setFilters({
      ...filters,
      tags: filters.tags.includes(tagValue)
        ? filters.tags.filter((t) => t !== tagValue)
        : [...filters.tags, tagValue],
    });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      tags: [],
      availability: 'all',
      sortBy: 'name',
    });
  };

  const FiltersMobile = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="md:hidden">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 bg-illusia-purple text-white h-5 w-5 p-0 flex items-center justify-center">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Category</h4>
            <Select
              value={filters.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Availability</h4>
            <Select
              value={filters.availability}
              onValueChange={handleAvailabilityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Not available</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Sort by</h4>
            <Select
              value={filters.sortBy}
              onValueChange={handleSortChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="By name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">By name</SelectItem>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="quantity">By quantity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.value}
                  variant={filters.tags.includes(tag.value) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    filters.tags.includes(tag.value) 
                      ? "bg-illusia-purple hover:bg-illusia-purple-dark" 
                      : ""
                  }`}
                  onClick={() => toggleTag(tag.value)}
                >
                  {tag.label}
                </Badge>
              ))}
              {tags.length === 0 && (
                <span className="text-muted-foreground text-sm">No available tags</span>
              )}
            </div>
          </div>

          <div className="pt-4">
            <SheetClose asChild>
              <Button variant="default" className="w-full" onClick={resetFilters}>
                Clear filters
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-10"
            value={filters.search}
            onChange={handleSearchChange}
          />
          {filters.search && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setFilters({ ...filters, search: '' })}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Select
            value={filters.sortBy}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[160px] hidden md:flex">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">By name</SelectItem>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="quantity">By quantity</SelectItem>
            </SelectContent>
          </Select>

          <FiltersMobile />

          <Collapsible 
            open={!isCollapsed} 
            onOpenChange={setIsCollapsed}
            className="hidden md:block"
          >
            <CollapsibleTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 bg-illusia-purple text-white h-5 w-5 p-0 flex items-center justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${!isCollapsed ? 'transform rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="bg-muted/40 p-4 rounded-lg mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Category</h4>
                    <Select
                      value={filters.category}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Availability</h4>
                    <Select
                      value={filters.availability}
                      onValueChange={handleAvailabilityChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="unavailable">Not available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.value}
                        variant={filters.tags.includes(tag.value) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          filters.tags.includes(tag.value) 
                            ? "bg-illusia-purple hover:bg-illusia-purple-dark" 
                            : ""
                        }`}
                        onClick={() => toggleTag(tag.value)}
                      >
                        {tag.label}
                      </Badge>
                    ))}
                    {tags.length === 0 && (
                      <span className="text-muted-foreground text-sm">No available tags</span>
                    )}
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Clear all
                    </Button>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center py-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {categories.find(c => c.value === filters.category)?.label || filters.category}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters({ ...filters, category: '' })}
              />
            </Badge>
          )}
          
          {filters.availability !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.availability === 'available' ? 'Available' : 'Not available'}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters({ ...filters, availability: 'all' })}
              />
            </Badge>
          )}
          
          {filters.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tags.find(t => t.value === tag)?.label || tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleTag(tag)}
              />
            </Badge>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground text-xs h-6 px-2"
            onClick={resetFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default ItemFilters;
