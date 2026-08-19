import type { Dispatch, SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Purchase } from "@/types/purchases/purchases-type";
import { getPurchaseAction } from "@/actions/purchases/get-purchase.action";
import { formatCurrency } from "@/utils";

interface Props {
  purchaseId: Purchase["_id"];
  openView: boolean;
  setOpenView: Dispatch<SetStateAction<boolean>>;
}

export const DetailPurchase = ({
  purchaseId,
  openView,
  setOpenView,
}: Props) => {
  const { data } = useQuery({
    queryKey: ["purchase", purchaseId],
    queryFn: () => getPurchaseAction(purchaseId),
    retry: false,
    enabled: !!purchaseId,
  });

  return (
    <Dialog
      open={openView}
      onOpenChange={(isOpen) => {
        setOpenView(isOpen);
      }}
    >
      <DialogContent
        className="
      w-[95vw] 
      max-w-3xl 
      2xl:max-w-2xl 
      max-h-[70vh] 
      overflow-y-auto
      p-4 
      sm:p-6
    "
      >
        {data ? (
          <>
            <DialogHeader className="pb-0">
              <div className="">
                <DialogTitle className="text-lg sm:text-xl">
                  Detalle de Compra
                </DialogTitle>
                <DialogDescription>
                  {data.status === "realized" ? (
                    <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                      Realizado
                    </Badge>
                  ) : (
                    <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                      Anulado
                    </Badge>
                  )}
                </DialogDescription>
              </div>
            </DialogHeader>

            {/* Header info */}
            <div className="space-y-4">
              {/* Grid responsiva: 1 columna en móvil, 2 en desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">
                    Proveedor
                  </p>
                  <p className="font-semibold text-sm sm:text-base">
                    {data.supplier.enterprise}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">
                    Nro. Factura / Lote
                  </p>
                  <p className="font-semibold text-sm sm:text-base break-all">
                    {data.invoiceNumber}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">
                    Fecha
                  </p>
                  <p className="font-medium text-sm sm:text-base">
                    {new Date(data.date).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">
                    Productos ({data.products.length})
                  </p>
                  <p className="font-medium text-sm sm:text-base">
                    {data.products.reduce(
                      (acc, product) => acc + product.quantity,
                      0
                    )}{" "}
                    unidades ingresadas
                  </p>
                </div>
              </div>

              {data.detail && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">
                    Nota / Observación
                  </p>
                  <p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3 wrap-break-word">
                    {data.detail}
                  </p>
                </div>
              )}

              {/* Summary card */}
              <div className="rounded-lg border bg-card p-3 sm:p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  Total Compra
                </p>
                {data.status === "realized" ? (
                  <p className="text-xl sm:text-2xl font-bold text-primary ">
                    Bs. {formatCurrency(data.totalAmount)}
                  </p>
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-red-700 line-through ">
                    Bs. {formatCurrency(data.totalAmount)}
                  </p>
                )}
              </div>

              <Separator />

              {/* Products detail */}
              <div>
                <h3 className="text-xs sm:text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">
                  Productos ({data.products.length})
                </h3>
                <div className="space-y-3">
                  {data.products.map((item, idx) => {
                    const subtotal = item.quantity * item.purchasePrice;

                    return (
                      <div
                        key={idx}
                        className="rounded-lg border p-3 sm:p-4 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium text-sm leading-tight wrap-break-word">
                              {item.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                #{item.internalCode} · {item.catalogCode}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {item.brand}
                              </Badge>
                            </div>
                          </div>
                          <p className="font-bold tabular-nums whitespace-nowrap text-sm sm:text-base">
                            Bs. {formatCurrency(subtotal)}
                          </p>
                        </div>

                        {/* Grid responsiva:  2 columnas en móvil, 3 en desktop */}
                        <div className="grid grid-cols-1 gap-2 text-xs">
                          <div className="flex justify-between items-center bg-muted/50 rounded px-2 py-1.5">
                            <p className="text-muted-foreground">Cantidad:</p>
                            <p className="font-semibold">{item.quantity}</p>
                          </div>
                          <div className="flex justify-between items-center bg-muted/50 rounded px-2 py-1.5">
                            <p className="text-muted-foreground">
                              Precio Compra:
                            </p>
                            <p className="font-semibold">
                              Bs. {formatCurrency(item.purchasePrice)}
                            </p>
                          </div>
                          <div className="flex justify-between items-center bg-muted/50 rounded px-2 py-1.5">
                            <p className="text-muted-foreground">
                              Precio Venta:
                            </p>
                            <p className="font-semibold">
                              Bs. {formatCurrency(item.salePrice)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Cargando datos</p>
        )}
      </DialogContent>
    </Dialog>
  );
};
