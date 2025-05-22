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
  name: z
    .object({
      en: z.string().min(1, "Name is required"),
    })
    .strict(),
  description: z
    .object({
      en: z.string().min(1, "Description is required"),
    })
    .strict(),
  contentSummary: z.string().min(1, "Content summary is required"),
  storageDetails: z
    .object({
      en: z.string().min(1, "Storage details are required"),
    })
    .strict(),
  storageLocation: z.string().min(1, "Storage location is required"),
  quantity: z.number().min(1, "Quantity is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()),
  imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ItemFormProps {
  item?: Item;
  onSuccess?: () => void;
}

export function ItemForm({ item, onSuccess }: ItemFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: { en: item?.name?.en || "" },
      description: { en: item?.description?.en || "" },
      contentSummary: item?.contentSummary || "",
      storageDetails: { en: item?.storageDetails?.en || "" },
      storageLocation: item?.storageLocation || "",
      quantity: item?.quantity || 1,
      category: item?.category || "",
      tags: item?.tags || [],
      imageUrl: item?.imageUrl || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      if (item) {
        const updateInput: UpdateItemInput = {
          id: item.id,
          name: { en: values.name.en },
          description: { en: values.description.en },
          contentSummary: values.contentSummary,
          storageDetails: { en: values.storageDetails.en },
          storageLocation: values.storageLocation,
          quantity: values.quantity,
          category: values.category,
          tags: values.tags,
          imageUrl: values.imageUrl,
        };
        await updateItem(updateInput);
        toast.success("Item updated");
      } else {
        const createInput: CreateItemInput = {
          name: { en: values.name.en },
          description: { en: values.description.en },
          contentSummary: values.contentSummary,
          storageDetails: { en: values.storageDetails.en },
          storageLocation: values.storageLocation,
          quantity: values.quantity,
          category: values.category,
          tags: values.tags,
          imageUrl: values.imageUrl,
        };
        await createItem(createInput);
        toast.success("Item created");
      }
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save item:", error);
      toast.error("Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name.en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description.en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
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
                <Textarea {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storageDetails.en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Storage Details</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
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
              <FormLabel>Location</FormLabel>
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
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Please wait..." : item ? "Edit Item" : "Create Item"}
        </Button>
      </form>
    </Form>
  );
}
