import { useState } from "react";
import { useNavigate } from "react-router";
import type { ColumnDef } from "@tanstack/react-table";

import {
  CheckCircle,
  Edit2,
  Eye,
  MoreHorizontal,
  Package,
  Tag,
  Truck,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/products/products.type";
import CardProduct from "./CardProduct";
import { ChangeState } from "./ChangeState";
import { getThumbnailUrl } from "@/utils";

export const columns: ColumnDef<Product>[] = [
  // Imagen
  {
    accessorKey: "internalCode",
    header: "# Producto",
    size: 300,
    cell: ({ row }) => {
      const [openView, setOpenView] = useState(false);
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
                onClick={() => setOpenView(true)}
                className="font-medium text-sm leading-tight truncate cursor-pointer"
                title={row.original.description}
              >
                {row.original.description}
              </p>

              <p className="text-sm text-muted-foreground truncate">
                #{row.original.internalCode} •{" "}
                {row.original.catalogCode === ""
                  ? "s/n"
                  : row.original.catalogCode}
              </p>
            </div>
          </div>

          <CardProduct
            product={row.original}
            openView={openView}
            setOpenView={setOpenView}
          />
        </>
      );
    },
  },
  // Marca
  {
    accessorKey: "brand",
    header: "Marca",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        <Tag className="h-3 w-3 mr-1" />
        {row.original.brand}
      </Badge>
    ),
  },
  // Ubicacion
  {
    accessorKey: "location",
    header: "Ubicación",
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground text-md">
          {row.original.location === "" ? "s/n" : row.original.location}
        </div>
      );
    },
  },

  // Categoria
  {
    accessorKey: "category",
    header: "Categoría",
    cell: ({ row }) => {
      return <Badge variant={"secondary"}>{row.original.category.name}</Badge>;
    },
    filterFn: (row, _, filterValue) => {
      const categoryId = row.original.category._id;
      return categoryId === filterValue;
    },
  },
  // Proveedor
  {
    accessorKey: "supplier",
    header: "Proveedor",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <Truck className="h-3 w-3 text-muted-foreground" />
        {row.original.supplier.enterprise}
      </div>
    ),
  },

  // Stock
  {
    accessorKey: "currentStock",
    header: () => <div className="text-center">Stock</div>,
    cell: ({ row }) => {
      const { currentStock, minStock } = row.original;
      return (
        <div className="text-center">
          <Badge
            variant={
              currentStock === 0
                ? "destructive"
                : currentStock <= minStock
                ? "secondary"
                : "default"
            }
          >
            {currentStock}
          </Badge>
        </div>
      );
    },
  },
  // P. Venta
  {
    accessorKey: "salePrice",
    header: () => <div className="text-right">P. Venta</div>,
    cell: ({ row }) => (
      <div className="text-right font-semibold">
        Bs {row.original.salePrice.toLocaleString()}
      </div>
    ),
  },
  // Estado
  {
    accessorKey: "isActive",
    header: () => <div className="text-center">Estado</div>,
    cell: ({ row }) => {
      const isActive = row.original.isActive;

      return (
        <div className="text-center">
          {isActive ? (
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              Activo
            </Badge>
          ) : (
            <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
              Inactivo
            </Badge>
          )}
        </div>
      );
    },
  },
  // Acciones
  {
    id: "Acciones",
    cell: ({ row }) => {
      const navigate = useNavigate();
      const productId = row.original._id;
      const [openChange, setOpenChange] = useState(false);

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigate(`/products/detail/${productId}`)}
              >
                <Eye />
                Ver
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate(`/products/edit/${productId}`)}
              >
                <Edit2 />
                Editar
              </DropdownMenuItem>

              <DropdownMenuItem
                variant={
                  row.original.isActive === true ? "destructive" : "default"
                }
                onClick={() => setOpenChange(true)}
              >
                {row.original.isActive === true ? (
                  <>
                    <XCircle />
                    Inactivar
                  </>
                ) : (
                  <>
                    <CheckCircle />
                    Activar
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ChangeState
            openChange={openChange}
            setOpenChange={setOpenChange}
            productId={productId}
            state={row.original.isActive}
          />
        </>
      );
    },
  },
];
