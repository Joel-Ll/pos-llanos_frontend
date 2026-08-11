import { Truck, ClipboardCheck, Star, CircleDollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { SupplierStats } from "@/types/suppliers/suppliers.type";

interface Props {
  stats: SupplierStats;
}

export const StatsCard = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      <Card className="py-0">
        <CardContent className="flex items-center gap-3 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10">
            <Truck className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.totalSuppliers}
            </p>

            <p className="font-semibold">Total proveedores</p>

            <p className="text-sm text-muted-foreground">
              Proveedores registrados
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-lime-500/10">
            <ClipboardCheck className="h-10 w-10 text-lime-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.activeSuppliers}
            </p>

            <p className="font-semibold">Proveedores activos</p>

            <p className="text-sm text-muted-foreground">
              Disponibles para compras
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-violet-500/10">
            <Star className="h-10 w-10 text-violet-500" />
          </div>

          {stats.topSupplier?.enterprise ? (
            <div className="space-y-0.5">
              <p className="text-2xl font-bold leading-none">
                {stats.topSupplier.enterprise}
              </p>

              <p className="font-semibold">Proveedor más utilizado</p>

              <p className="text-sm text-muted-foreground">
                {stats.topSupplier.purchases} compras realizadas
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              <p className="text-2xl font-bold leading-none">--</p>

              <p className="font-semibold">Sin registro</p>

              <p className="text-sm text-muted-foreground">
                sin regisro de proveedores
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categorías sin productos */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-amber-500/10">
            <CircleDollarSign className="h-10 w-10 text-amber-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              <span className="text-2xl">Bs. </span>{" "}
              {stats.totalAmount.toLocaleString()}
            </p>

            <p className="font-semibold">Total comprado</p>

            <p className="text-sm text-muted-foreground">
              Histórico de compras
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
