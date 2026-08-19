import { useState } from "react";
import { useNavigate } from "react-router";
import type { ColumnDef } from "@tanstack/react-table";

import {
  CheckCircle,
  Edit2,
  EyeIcon,
  MoreHorizontal,
  Phone,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SupplierDataStats } from "@/types/suppliers/suppliers.type";
import { formatCurrency, formatDate } from "@/utils";
import { differenceInCalendarDays } from "date-fns";
import { DetailSupplier } from "./DetailSupplier";
import { ChangeState } from "./ChangeState";

export const columns: ColumnDef<SupplierDataStats>[] = [
  // Empresa
  {
    accessorKey: "enterprise",
    header: "Empresa",
    cell: ({ row }) => {
      const enterprise = row.original.enterprise;

      return <p className="font-medium block">{enterprise}</p>;
    },
  },
  // Contacto
  {
    accessorKey: "contact",
    header: "Contácto",
    cell: ({ row }) => {
      return (
        <div className="text-sm space-y-0.5">
          <div className="font-medium">{row.original.contact.name}</div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Phone className="h-3 w-3" /> {row.original.contact.phone}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "totalPurchases",
    header: () => <div className="text-center">Compras</div>,
    cell: ({ row }) => {
      return (
        <div className="flex flex-col items-center">
          <p className="font-semibold">{row.original.totalPurchases}</p>
          <p className="text-muted-foreground text-xs">compras</p>
        </div>
      );
    },
  },
  {
    accessorKey: "lastPurchase",
    header: () => <div className="text-center">Última compra</div>,
    cell: ({ row }) => {
      const lastPurchase = row.original.lastPurchase;
      return (
        <>
          {lastPurchase ? (
            <div className="flex flex-col items-center">
              <p className="font-semibold">
                {formatDate(new Date(lastPurchase))}
              </p>
              <p className="text-muted-foreground text-xs">
                Hace {differenceInCalendarDays(lastPurchase, new Date())} días
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              Sin registro...
            </p>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "totalPurchased",
    header: () => <div className="text-right">Total comprado</div>,

    cell: ({ row }) => {
      return (
        <p className="font-semibold  text-right">
          Bs.{" "}
          <span className="text-muted-foreground font-normal">
            {formatCurrency(row.original.totalPurchased)}
          </span>
        </p>
      );
    },
  },
  // Estado
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
  // Acciones
  {
    id: "actions",
    cell: ({ row }) => {
      const navigate = useNavigate();
      const supplierId = row.original._id;
      const [openView, setOpenView] = useState(false);
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
                onClick={() => {
                  setOpenView(true);
                }}
              >
                <EyeIcon />
                Ver
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate(`/suppliers/edit/${supplierId}`)}
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
            state={row.original.isActive}
            openChange={openChange}
            setOpenChange={setOpenChange}
            supplierId={supplierId}
          />

          <DetailSupplier
            supplierId={supplierId}
            openView={openView}
            setOpenView={setOpenView}
          />
        </>
      );
    },
  },
];
