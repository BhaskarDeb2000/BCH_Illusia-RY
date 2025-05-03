import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Item, CreateItemInput, UpdateItemInput } from "@/types/item";
import { createItem, updateItem } from "@/lib/api/items";
import { toast } from "sonner";

const formSchema = z.object({
  number: z.number().min(1, "Item number is required"),
  description: z.string().min(1, "Description is required"),
  contentSummary: z.string().min(1, "Content summary is required"),
  storageDetails: z.string().min(1, "Storage details are required"),
  storageLocation: z.string().min(1, "Storage location is required"),
  quantity: z.number().min(1, "Quantity is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()),
  imageUrl: z.string().optional(),
});

interface ItemFormProps {
  item?: Item;
  onSuccess?: () => void;
}

export function ItemForm({ item, onSuccess }: ItemFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: item?.number || 0,
      description: item?.description || "",
      contentSummary: item?.contentSummary || "",
      storageDetails: item?.storageDetails || "",
      storageLocation: item?.storageLocation || "",
      quantity: item?.quantity || 1,
      category: item?.category || "",
      tags: item?.tags || [],
      imageUrl: item?.imageUrl || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (item) {
        const updateInput: UpdateItemInput = {
          id: item.id,
          ...values,
        };
        await updateItem(updateInput);
        toast.success("Item updated successfully");
      } else {
        const createInput: CreateItemInput = values;
        await createItem(createInput);
        toast.success("Item created successfully");
      }
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save item:", error);
      toast.error("Failed to save item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Number</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contentSummary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content Summary</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storageDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Storage Details</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storageLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Storage Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : item ? "Update Item" : "Create Item"}
        </Button>
      </form>
    </Form>
  );
}
