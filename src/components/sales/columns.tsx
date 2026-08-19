import { useNavigate } from "react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, Eye, MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SaleComun } from "@/types/sales/sales.type";
import { formatDate } from "date-fns";
import { formatCurrency } from "@/utils";

export const columns: ColumnDef<SaleComun>[] = [
  {
    accessorKey: "code",
    header: "N° Venta",
    cell: ({ row }) => (
      <div className="font-medium text-primary">{row.original.code}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Calendar className="h-3.5 w-3.5" />
        {formatDate(row.original.createdAt, "Pp")}
      </div>
    ),
  },
  {
    id: "client",
    accessorFn: (row) =>
      `${row.client?.name ?? ""} ${row.client?.document ?? ""}`,

    header: "Cliente",

    cell: ({ row }) => {
      const client = row.original.client;

      if (!client?.name) return <div className="font-medium text-sm">S/N</div>;

      return (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{client.name}</span>

          <span className="text-xs text-muted-foreground">
            NIT/CI: {client.document || "s/n"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "itemsCount",
    header: "Items",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">
          Productos: {row.original.itemsCount}
        </span>
        <span className="text-xs text-muted-foreground">
          Servicios: {row.original.servicesCount}
        </span>
      </div>
    ),
  },

  {
    accessorKey: "transactions",
    header: "Método Pago",
    cell: ({ row }) => {
      const method =
        row.original.transactions.length > 1
          ? "EFECTIVO y QR"
          : row.original.transactions[0].method === "cash"
          ? "EFECTIVO"
          : "QR";
      return (
        <Badge variant="outline" className="text-xs">
          {method}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: () => <div className="text-right">Total</div>,

    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="text-right">
          {status === "registered" ? (
            <p className="text-sky-600 font-medium">
              Bs. {formatCurrency(row.original.totalAmount)}
            </p>
          ) : (
            <p className="text-red-700 line-through font-medium">
              Bs. {formatCurrency(row.original.totalAmount)}
            </p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Estado</div>,
    cell: ({ row }) => {
      const state = row.original.status;

      return (
        <div className="text-center">
          {state === "registered" ? (
            <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              Realizado
            </Badge>
          ) : (
            <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
              Cancelado
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "Acciones",
    cell: ({ row }) => {
      const navigate = useNavigate();
      const saleId = row.original._id;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigate(`/sales/detail/${saleId}`)}
              >
                <Eye />
                Ver
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
