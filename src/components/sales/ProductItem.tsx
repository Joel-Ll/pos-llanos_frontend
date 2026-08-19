import type { UseFormSetValue } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import type { SalesFormValues } from "@/types/sales/sales.type";
import type { CatalogProduct } from "@/types/products/products.type";
import { Package, Plus } from "lucide-react";
import { formatCurrency } from "@/utils";

interface Props {
  product: CatalogProduct;
  items: SalesFormValues["items"];
  setValue: UseFormSetValue<SalesFormValues>;
}

export default function ProductItem({ product, items, setValue }: Props) {
  const addProduct = (product: CatalogProduct) => {
    const existing = items.find((i) => i.productId === product._id);
    if (existing) {
      toast.info("Este producto ya está en la lista");
      return;
    }
    if (product.currentStock === 0) {
      toast.error("Producto sin stock");
      return;
    }

    const newItem = {
      productId: product._id,
      internalCode: product.internalCode,
      catalogCode: product.catalogCode,
      description: product.description,
      brand: product.brand,
      quantity: 1,
      unitPrice: product.salePrice,
      discount: 0,
      subtotal: product.salePrice,
    };
    setValue("items", [...items, newItem], { shouldValidate: true });
    toast.success("Producto agregado");
  };

  return (
    <Card
      className="hover:shadow-md transition cursor-pointer py-5"
      onClick={() => addProduct(product)}
    >
      <CardContent className="flex flex-col h-full px-5">
        {/* CONTENIDO */}
        <div className="flex-1">
          {/* Imagen */}
          <div className="h-40 rounded-md bg-muted mb-3 overflow-hidden relative">
            {product.image ? (
              <img
                src={product.image}
                alt={product.description}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            )}

            <div className="absolute top-2 left-2">
              <div className="inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs bg-card/70 text-card-foreground border-border">
                {product.brand}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs truncate">
                #{product.internalCode} •{" "}
                {product.catalogCode ? product.catalogCode : "s/n"}
              </p>
            </div>

            <p className="font-medium text-xs line-clamp-2 min-h-8">
              {product.description}
            </p>

            <Badge
              variant={product.currentStock === 0 ? "destructive" : "outline"}
            >
              Stock: {product.currentStock}
            </Badge>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-4 mt-auto">
          <span className="font-bold text-primary">
            Bs. {formatCurrency(product.salePrice)}
          </span>

          <Button
            type="button"
            size="icon"
            className="h-8 w-8 shrink-0"
            disabled={product.currentStock <= 0}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
