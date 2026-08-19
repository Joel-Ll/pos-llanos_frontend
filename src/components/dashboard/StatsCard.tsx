import {
  Boxes,
  PackageCheck,
  ReceiptText,
  ShoppingCart,
  TrendingUp,
  TriangleAlert,
  Truck,
  Wallet,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { StatsDash } from "@/types/dashboard/dashboard.type";
import { formatCurrency } from "@/utils";

interface Props {
  stats: StatsDash;
}

export const StatsCard = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {/* Ventas de hoy */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-3 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10">
            <ShoppingCart className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              <span className="text-2xl">Bs. </span>{" "}
              {formatCurrency(stats.todaySales)}
            </p>
            <p className="font-semibold">Ventas hoy</p>

            <p className="text-sm text-muted-foreground">
              Ingresos registrados durante la jornada.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ganancias de hoy */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-emerald-500/10">
            <TrendingUp className="h-10 w-10 text-emerald-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              <span className="text-2xl">Bs. </span>{" "}
              {formatCurrency(stats.todayProfit)}
            </p>

            <p className="font-semibold">Ganancia de hoy</p>

            <p className="text-sm text-muted-foreground">
              Utilidad generada por las ventas de hoy.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ventas realizadas */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-amber-500/10">
            <ReceiptText className="h-10 w-10 text-amber-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.salesCount}
            </p>

            <p className="font-semibold">Ventas realizadas</p>

            <p className="text-sm text-muted-foreground">
              Transacciones completadas durante la jornada.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Productos vendidos */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-violet-500/10">
            <PackageCheck className="h-10 w-10 text-violet-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.productsSold}
            </p>

            <p className="font-semibold">Productos vendidos</p>

            <p className="text-sm text-muted-foreground">
              Unidades comercializadas en el día.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Productos registrados */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-cyan-500/10">
            <Boxes className="h-10 w-10 text-cyan-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.totalProducts}
            </p>

            <p className="font-semibold">Productos</p>

            <p className="text-sm text-muted-foreground">
              Artículos activos disponibles en el catálogo.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bajo stock */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-red-500/10">
            <TriangleAlert className="h-10 w-10 text-red-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.lowStockProducts}
            </p>

            <p className="font-semibold">Bajo stock</p>

            <p className="text-sm text-muted-foreground">
              Productos que requieren reposición.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Compras de hoy */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-orange-500/10">
            <Truck className="h-10 w-10 text-orange-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              <span className="text-2xl">Bs. </span>{" "}
              {formatCurrency(stats.todayPurchases)}
            </p>

            <p className="font-semibold">Compras de hoy</p>

            <p className="text-sm text-muted-foreground">
              Inversión realizada en abastecimiento hoy.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Estado de caja */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-xl ${
              stats.cashStatus ? "bg-teal-500/10" : "bg-red-500/10"
            }`}
          >
            <Wallet
              className={`h-10 w-10 ${
                stats.cashStatus ? "text-teal-500" : "text-red-500"
              }`}
            />
          </div>

          <div className="space-y-0.5">
            <p className="text-2xl font-bold leading-none">
              {stats.cashStatus ? "Caja Abierta" : "Caja Cerrada"}
            </p>

            <p className="text-sm text-muted-foreground">
              {stats.cashStatus
                ? "Abierto para realizar ventas"
                : "Abra una caja para poder realizar ventas"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
