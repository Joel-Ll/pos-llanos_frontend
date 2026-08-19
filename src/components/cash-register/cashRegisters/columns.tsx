import { useNavigate } from "react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CashRegisterData } from "@/types/cash-register/cash-register.type";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils";

export const columns: ColumnDef<CashRegisterData>[] = [
  {
    accessorKey: "code",
    header: "Caja",
    cell: ({ row }) => (
      <div className="font-medium text-sm">{row.original.code}</div>
    ),
  },
  {
    accessorKey: "user",
    header: "Responsable",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-sm">
        <User className="h-3.5 w-3.5 text-muted-foreground" />
        {row.original.user}
      </div>
    ),
  },
  {
    accessorKey: "openedAt",
    header: "Apertura",
    filterFn: (row, id, value: Date | undefined) => {
      if (!value) return true;

      const rowDate = new Date(row.getValue(id));

      return (
        rowDate.getFullYear() === value.getFullYear() &&
        rowDate.getMonth() === value.getMonth() &&
        rowDate.getDate() === value.getDate()
      );
    },
    cell: ({ row }) => <div>{formatDate(new Date(row.original.openedAt))}</div>,
  },
  {
    accessorKey: "totalMovements",
    header: "Movimientos",
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant={"secondary"}>{row.original.totalMovements}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "expectedAmount",
    header: () => <div className="text-right">Esperado</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        Bs. {formatCurrency(row.original.expectedAmount)}
      </div>
    ),
  },
  {
    accessorKey: "countedAmount",
    header: () => <div className="text-right">Contado</div>,
    cell: ({ row }) => {
      const { countedAmount, status } = row.original;

      return (
        <div
          className={cn(
            "text-right font-semibold",
            status === "completed" && "text-emerald-600",
            status === "with_difference" && "text-amber-600",
            status === "open" && "text-muted-foreground"
          )}
        >
          {countedAmount === 0
            ? "---"
            : ` Bs. ${formatCurrency(countedAmount)}`}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusConfig = {
        open: {
          label: "Abierta",
          className:
            "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
        },
        completed: {
          label: "Completada",
          className: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
        },
        with_difference: {
          label: "Con diferencia",
          className: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
        },
      };
      return (
        <Badge className={statusConfig[status].className}>
          {statusConfig[status].label}
        </Badge>
      );
    },
  },
  {
    id: "Acciones",
    cell: ({ row }) => {
      const navigate = useNavigate();
      const cashRegisterId = row.original._id;

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
                onClick={() =>
                  navigate(`/cash-register/detail/${cashRegisterId}`)
                }
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
