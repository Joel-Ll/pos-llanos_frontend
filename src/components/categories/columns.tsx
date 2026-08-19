import { useState } from "react";
import { useNavigate } from "react-router";

import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  Edit2,
  EyeIcon,
  MoreHorizontal,
  Tag,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import type { Category } from "@/types/categories/categories.types";
import EditCategory from "./EditCategory";
import { ChangeState } from "./ChangeState";
import { formatCurrency } from "@/utils";

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Categoría",
    cell: ({ row }) => {
      const navigate = useNavigate();
      const categoryId = row.original._id;
      return (
        <div
          className="flex items-center gap-2 "
          onClick={() => navigate(`/categories/view/${categoryId}`)}
        >
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Tag className="h-4 w-4 text-primary" />
          </div>
          <p className="font-medium cursor-pointer">{row.original.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "totalProducts",
    header: () => <div className="text-center">Productos</div>,
    cell: ({ row }) => {
      return (
        <div className="flex flex-col items-center">
          <p className="font-semibold">{row.original.totalProducts}</p>
          <p className="text-muted-foreground text-xs">Productos</p>
        </div>
      );
    },
  },

  {
    accessorKey: "stockTotal",
    header: () => <div className="text-center">Stock total</div>,
    cell: ({ row }) => {
      return (
        <div className="flex flex-col items-center">
          <p className="font-semibold">{row.original.stockTotal}</p>
          <p className="text-muted-foreground text-xs">unidades</p>
        </div>
      );
    },
  },
  {
    accessorKey: "inventoryValue",
    header: () => <div className="text-right">Valor inventario</div>,
    cell: ({ row }) => {
      return (
        <p className="font-bold text-right">
          Bs.
          <span className="font-normal text-muted-foreground">
            {formatCurrency(row.original.inventoryValue)}
          </span>
        </p>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => {
      const isActive: boolean = row.getValue("isActive");

      return (
        <>
          {isActive ? (
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              Activo
            </Badge>
          ) : (
            <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
              Inactivo
            </Badge>
          )}
        </>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const categoryId = row.original._id;
      const navigate = useNavigate();
      const [open, setOpen] = useState(false);
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
                onClick={() => navigate(`/categories/view/${categoryId}`)}
              >
                <EyeIcon />
                Ver
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpen(true)}>
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

          <EditCategory
            open={open}
            setOpen={setOpen}
            categoryId={categoryId}
            categoryObj={row.original}
          />

          <ChangeState
            openChange={openChange}
            setOpenChange={setOpenChange}
            categoryId={categoryId}
            state={row.original.isActive}
          />
        </>
      );
    },
  },
];
