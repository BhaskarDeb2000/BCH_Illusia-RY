import { format } from "date-fns";
import { Calendar, MapPin, Tag } from "lucide-react";
import { Item } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-xl">{item.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {item.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{item.category?.name}</span>
          </div>
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <a href={`/items/${item.id}`}>View Details</a>
        </Button>
      </CardFooter>
    </Card>
  );
}
