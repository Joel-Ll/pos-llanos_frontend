import { AlertTriangle, Package, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductsStats } from "@/types/products/products.type";

interface Props {
  stats: ProductsStats;
}

export const StatsCard = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      <Card className="py-0">
        <CardContent className="flex items-center gap-3 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10">
            <Package className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.totalProducts}
            </p>

            <p className="font-semibold">Total productos</p>

            <p className="text-sm text-muted-foreground">
              Todos los productos registrados
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-lime-500/10">
            <CheckCircle className="h-10 w-10 text-lime-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.activeProducts}
            </p>

            <p className="font-semibold">Productos activos</p>

            <p className="text-sm text-muted-foreground">En uso actualmente</p>
          </div>
        </CardContent>
      </Card>

      {/* Categorías sin productos */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-amber-500/10">
            <AlertTriangle className="h-10 w-10 text-amber-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.lowStockCount}
            </p>

            <p className="font-semibold">Productos</p>

            <p className="text-sm text-muted-foreground">con bajo stock</p>
          </div>
        </CardContent>
      </Card>

      {/* 🚫 Sin Stock */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-destructive/10">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.outOfStockCount}
            </p>

            <p className="font-semibold">Productos</p>

            <p className="text-sm text-muted-foreground">sin stock</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
