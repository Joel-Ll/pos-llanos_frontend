import type { UseFormSetValue } from "react-hook-form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import type { SalesFormValues } from "@/types/sales/sales.type";
import { formatCurrency } from "@/utils";
import { Minus, Plus, Trash2 } from "lucide-react";

interface Props {
  items: SalesFormValues["items"];
  item: SalesFormValues["items"][0];
  setValue: UseFormSetValue<SalesFormValues>;
}

export default function ProductSaleItem({ item, items, setValue }: Props) {
  const updateItem = (
    productId: string,
    field: keyof SalesFormValues["items"][0],
    value: number
  ) => {
    const updated = items.map((item) => {
      if (item.productId !== productId) return item;
      const updatedItem = {
        ...item,
        [field]: value,
      };

      updatedItem.subtotal = updatedItem.quantity * updatedItem.unitPrice;

      return updatedItem;
    });

    setValue("items", updated);
  };

  const removeItem = (productId: string) => {
    const updated = items.filter((item) => item.productId !== productId);
    setValue("items", updated);
  };

  return (
    <div className="flex flex-col gap-4 py-4  md:grid md:grid-cols-12 md:items-center">
      {/* Información */}
      <div className="md:col-span-6 flex items-start gap-3 min-w-0">
        <div className="min-w-0 flex-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="truncate text-sm font-medium">
                  {item.description}
                </p>
              </TooltipTrigger>

              <TooltipContent>{item.description}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <p className="truncate text-xs text-muted-foreground">
            #{item.internalCode} • {item.brand}
          </p>

          <p className="mt-1 text-xs font-semibold">
            {item.quantity} × Bs {formatCurrency(item.unitPrice)}
          </p>
        </div>
      </div>

      {/* Cantidad */}
      <div className="md:col-span-3 flex justify-start md:justify-center">
        <div className="flex h-10 items-center overflow-hidden rounded-md border">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none"
            disabled={item.quantity <= 1}
            onClick={() =>
              updateItem(item.productId, "quantity", item.quantity - 1)
            }
          >
            <Minus className="h-4 w-4" />
          </Button>

          <div className="w-12 text-center text-sm font-medium">
            {item.quantity}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none"
            onClick={() =>
              updateItem(item.productId, "quantity", item.quantity + 1)
            }
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-3">
        <span className="text-sm font-semibold whitespace-nowrap">
          Bs {formatCurrency(item.subtotal)}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => removeItem(item.productId)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
