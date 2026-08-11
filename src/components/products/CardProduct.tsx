import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/types/products/products.type";
import { Badge } from "@/components/ui/badge";

interface Props {
  product: Product | undefined;
  openView: boolean;
  setOpenView: Dispatch<SetStateAction<boolean>>;
}

export default function CardProduct({ product, openView, setOpenView }: Props) {
  return (
    <Dialog
      open={openView}
      onOpenChange={(isOpen) => {
        setOpenView(isOpen);
      }}
    >
      {product && (
        <DialogContent className="max-w-3xl p-0 overflow-hidden border-0">
          <DialogTitle>
            <div className="relative h-96 overflow-hidden group">
              {product.image ? (
                <>
                  <img
                    src={product.image}
                    alt={product.description}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Máscara oscura con gradiente */}
                  <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/70"></div>
                </>
              ) : (
                <>
                  <div className="w-full h-full bg-linear-to-br from-primary/20 via-accent/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-8xl opacity-30">📦</span>
                  </div>
                  <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/70"></div>
                </>
              )}

              <div className="absolute top-4 left-4">
                <Badge
                  variant="outline"
                  className="bg-card text-card-foreground border-border backdrop-blur-sm"
                >
                  {product.category.name}
                </Badge>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-end justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl  font-bold mb-2 drop-shadow-lg">
                      {product.description}
                    </h2>
                    <p className="text-sm text-white/90 drop-shadow-md">
                      Código:{" "}
                      <span className="font-mono font-semibold">
                        {product.internalCode}
                      </span>
                    </p>
                  </div>

                  {product.salePrice && (
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-md border border-white/20">
                      <div className="text-xs text-white/80 uppercase tracking-wider mb-1">
                        Precio
                      </div>
                      <div className="text-3xl font-bold text-white">
                        Bs. {product.salePrice}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogTitle>

          <DialogDescription></DialogDescription>

          <div className="p-6 space-y-4">
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Marca
                </p>
                <p className="text-base font-semibold text-foreground">
                  {product.brand}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Proveedor
                </p>
                <p className="text-base font-semibold text-foreground">
                  {product.supplier.enterprise}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase">Stock</p>
                <p className="text-base font-semibold text-foreground">
                  {product.currentStock} {product.unidadMedida}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
