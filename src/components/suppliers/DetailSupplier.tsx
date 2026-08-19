import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Building2, MapPin, Phone } from "lucide-react";
import type { Supplier } from "@/types/suppliers/suppliers.type";
import { getSupplierAction } from "@/actions/suppliers/get-supplier.action";
import { formatCurrency, formatDate } from "@/utils";

interface Props {
  supplierId: Supplier["_id"];
  openView: boolean;
  setOpenView: Dispatch<SetStateAction<boolean>>;
}

export const DetailSupplier = ({
  supplierId,
  openView,
  setOpenView,
}: Props) => {
  const { data, refetch } = useQuery({
    queryKey: ["supplier", supplierId],
    queryFn: () => getSupplierAction(supplierId),
    retry: false,
    enabled: !!supplierId,
  });

  useEffect(() => {
    refetch();
  }, [supplierId, openView]);

  const handleClose = () => {
    setOpenView(false);
  };

  return (
    <Dialog
      open={openView}
      onOpenChange={(isOpen) => {
        setOpenView(isOpen);
      }}
    >
      <DialogContent className="w-[95vw] max-w-xl max-h-[85vh] overflow-hidden p-0 flex flex-col">
        <div className="p-5 border-b shrink-0 space-y-4">
          {/* Nombre + badge + descripción */}
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2.5 rounded-lg shrink-0">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              {data?.isActive ? (
                <Badge className="mb-1 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                  Activo
                </Badge>
              ) : (
                <Badge className="mb-1 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                  Inactivo
                </Badge>
              )}
              <DialogTitle className="text-base leading-tight">
                {data?.enterprise}
              </DialogTitle>
              {data?.description && (
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  {data?.description}
                </DialogDescription>
              )}
            </div>
          </div>

          {/* Métricas siempre visibles */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold">{data?.totalPurchases}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Compras</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold">
                Bs. {formatCurrency(data?.totalAmount || 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Total invertido
              </p>
            </div>
          </div>
        </div>

        {/* ── Body scrollable ──────────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Contacto + Ubicación */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Contacto y ubicación
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  Persona de contacto
                </p>
                <p className="font-medium">{data?.contact.name || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Teléfono</p>
                <div className="flex items-center gap-1 font-medium">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  {data?.contact.phone || "—"}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Ciudad</p>
                <div className="flex items-center gap-1 font-medium">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  {data?.location.city || "—"}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  Dirección
                </p>
                <p className="text-muted-foreground">
                  {data?.location.address || "—"}
                </p>
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* Productos de referencia */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Productos de referencia
            </p>
            <div className="flex flex-wrap gap-2">
              {data?.productsRef.map((cat) => (
                <span
                  key={cat}
                  className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <hr className="border-border" />

          {/* Última compra */}
          <div className="flex items-center justify-between text-sm">
            <p className="text-xs text-muted-foreground">Última compra</p>
            <p className="font-medium">
              {data?.lastPurchase
                ? formatDate(new Date(data.lastPurchase))
                : "Sin actividad"}
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cerrar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
