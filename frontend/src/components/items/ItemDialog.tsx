import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Item } from "@/types/item";
import { ItemForm } from "./ItemForm";

interface ItemDialogProps {
  item?: Item;
  onSuccess?: () => void;
}

export function ItemDialog({ item, onSuccess }: ItemDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={item ? "ghost" : "default"}
          size={item ? "icon" : "default"}
        >
          {item ? (
            <Pencil className="h-4 w-4" />
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create Item
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Create Item"}</DialogTitle>
        </DialogHeader>
        <ItemForm item={item} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
