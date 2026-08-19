import { useState } from "react";
import { useNavigate } from "react-router";
import type { ColumnDef } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { Client } from "@/types/clients/clients.type";
import {
  Building2,
  CheckCircle,
  Edit2,
  Eye,
  Mail,
  MoreHorizontal,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import DetailClient from "./DetailClient";
import { ChangeState } from "./ChangeState";
import { formatCurrency } from "@/utils";

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "razonSocial",
    header: "Cliente",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          {row.original.typeClient === "company" ? (
            <Building2 className="h-4 w-4 text-primary" />
          ) : (
            <User className="h-4 w-4 text-primary" />
          )}
        </div>
        <div className="flex flex-col">
          <p className="font-medium">{row.original.razonSocial}</p>
          <p className="text-muted-foreground text-xs">
            nit/ci: <span>{row.original.documentoId}</span>
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "typeClient",
    header: "Tipo cliente",
    cell: ({ row }) => {
      const typeClient = row.original.typeClient;
      return (
        <div className="text-left">
          <Badge variant={typeClient === "company" ? "default" : "secondary"}>
            {typeClient === "company" ? "Empresa" : "Persona"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Contácto",
    cell: ({ row }) => (
      <div className="text-sm space-y-0.5">
        {row.original.phone && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Phone className="h-3 w-3" /> {row.original.phone}
          </div>
        )}
        {row.original.email && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Mail className="h-3 w-3" /> {row.original.email}
          </div>
        )}
      </div>
    ),
  },

  {
    accessorKey: "totalPurchases",
    header: () => <div className="text-center">Registro de compras</div>,
    cell: ({ row }) => (
      <p className="font-semibold text-center">
        ({row.original.totalPurchases}){" "}
        <span className="text-muted-foreground font-normal">compras</span>
      </p>
    ),
  },

  {
    accessorKey: "totalAmount",
    header: () => <div className="text-right">Total comprado</div>,
    cell: ({ row }) => (
      <p className="font-semibold text-right">
        Bs.{" "}
        <span className="text-muted-foreground font-normal">
          {formatCurrency(row.original.totalAmount ?? 0)}
        </span>
      </p>
    ),
  },

  {
    accessorKey: "state",
    header: () => <div className="text-center">Estado</div>,
    cell: ({ row }) => {
      const state = row.original.state;
      return (
        <div className="text-center">
          {state ? (
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
  {
    id: "Acciones",
    cell: ({ row }) => {
      const [openChange, setOpenChange] = useState(false);
      const [openView, setOpenView] = useState(false);
      const navigate = useNavigate();
      const clientId = row.original._id;

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
              <DropdownMenuItem onClick={() => setOpenView(true)}>
                <Eye />
                Ver
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/clients/edit/${clientId}`)}
              >
                <Edit2 />
                Editar
              </DropdownMenuItem>

              <DropdownMenuItem
                variant={
                  row.original.state === true ? "destructive" : "default"
                }
                onClick={() => setOpenChange(true)}
              >
                {row.original.state === true ? (
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

          <DetailClient
            openView={openView}
            setOpenView={setOpenView}
            clientObj={row.original}
          />

          <ChangeState
            openChange={openChange}
            setOpenChange={setOpenChange}
            clientId={row.original._id}
            state={row.original.state}
          />
        </>
      );
    },
  },
];
