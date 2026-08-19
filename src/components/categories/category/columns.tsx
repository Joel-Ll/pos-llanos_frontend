import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { CategoryProduct } from "@/types/categories/categories.types";
import { Package } from "lucide-react";
import { formatCurrency, getThumbnailUrl } from "@/utils";

const getStockStatus = (current: number, min: number) => {
  if (current === 0)
    return {
      label: "Sin stock",
      variant: "destructive" as const,
      className: "bg-destructive/10 text-destructive border-destructive/20",
    };
  if (current < min)
    return {
      label: "Stock bajo",
      variant: "outline" as const,
      className: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    };
  return {
    label: "Normal",
    variant: "outline" as const,
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  };
};

const margin = (product: CategoryProduct) => {
  const diff = +(product.salePrice - product.purchasePrice).toFixed(2);
  const pct = +((diff / product.purchasePrice) * 100).toFixed(0);
  return { diff, pct };
};

export const columns: ColumnDef<CategoryProduct>[] = [
  // Imagen
  {
    accessorKey: "internalCode",
    header: "# Producto",
    cell: ({ row }) => {
      const imageUrl = row.original.image as string;

      return (
        <>
          <div className="flex items-center gap-2 w-[300px]">
            {imageUrl ? (
              <img
                src={getThumbnailUrl(imageUrl)}
                alt={row.original.description}
                className="h-15 w-15 rounded object-cover shrink-0"
                loading="lazy"
              />
            ) : (
              <div className="h-15 w-15 rounded bg-muted flex items-center justify-center shrink-0">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
            )}

            <div className="min-w-0 flex-1 flex flex-col gap-1">
              <p
                className="font-medium text-sm leading-tight truncate"
                title={row.original.description}
              >
                {row.original.description}
              </p>

              <p className="text-sm text-muted-foreground truncate">
                {row.original.catalogCode === ""
                  ? "s/n"
                  : row.original.catalogCode}{" "}
                - #{row.original.internalCode}
              </p>
            </div>
          </div>
        </>
      );
    },
  },
  // Marca
  {
    accessorKey: "brand",
    header: "Marca",
    cell: ({ row }) => <Badge variant="outline">{row.original.brand}</Badge>,
  },
  // stock
  {
    accessorKey: "currentStock",
    header: () => <div className="text-center">Stock</div>,
    filterFn: (row, _, value) => {
      const stock = row.original.currentStock;
      const min = row.original.minStock;

      switch (value) {
        case "ok":
          return stock > min;

        case "low":
          return stock > 0 && stock <= min;

        case "out":
          return stock === 0;

        default:
          return true;
      }
    },
    cell: ({ row }) => {
      const status = getStockStatus(
        row.original.currentStock,
        row.original.minStock
      );
      return (
        <div className="flex gap-5 items-center text-center justify-center">
          <p className="text-center font-semibold">
            {row.original.currentStock}/{row.original.minStock}
          </p>
          <Badge variant={status.variant} className={status.className}>
            {status.label}
          </Badge>
        </div>
      );
    },
  },
  // Precio de compra
  {
    accessorKey: "purchasePrice",
    header: () => <div className="text-right">P. Compra</div>,
    cell: ({ row }) => (
      <div className="text-right">
        Bs. {formatCurrency(row.original.purchasePrice)}
      </div>
    ),
  },
  // Precio de venta
  {
    accessorKey: "salePrice",
    header: () => <div className="text-right">P. Venta</div>,
    cell: ({ row }) => (
      <div className="text-right">
        Bs. {formatCurrency(row.original.salePrice)}
      </div>
    ),
  },
  // Margen de ganancia
  {
    accessorKey: "profit",
    header: () => <div className="text-center">Margen</div>,
    cell: ({ row }) => {
      const m = margin(row.original);

      // Determinar el color según el porcentaje
      let colorClass = "";
      let icon = "";

      if (m.pct < 0) {
        colorClass = "text-red-600 bg-red-50";
        icon = "↓";
      } else if (m.pct <= 30) {
        colorClass = "text-yellow-600 bg-yellow-50";
        icon = "→";
      } else {
        colorClass = "text-emerald-600 bg-emerald-50";
        icon = "↑";
      }

      return (
        <div className="text-center px-2 py-0.5 text-xs">
          <span className={`font-medium px-2 py-1 rounded-full ${colorClass}`}>
            {icon} Bs. {m.diff} ({m.pct}%)
          </span>
        </div>
      );
    },
  },
  // STATE
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => {
      const isActive: boolean = row.getValue("isActive");

      return (
        <Badge
          variant={"outline"}
          className={
            isActive
              ? "border-emerald-500 text-emerald-600 bg-emerald-50"
              : "border-red-500 text-red-600 bg-red-50"
          }
        >
          {isActive ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
];
