import { Wallet, ShoppingCart, TrendingUp, Tags } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { SalesStats } from "@/types/sales/sales.type";

interface Props {
  stats: SalesStats;
}

export const StatsCard = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {/* Total Ventas */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-3 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10">
            <ShoppingCart className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.totalSales}
            </p>

            <p className="font-semibold">Ventas realizadas</p>

            <p className="text-sm text-muted-foreground">
              Cantidad de ventas completadas en el período.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Total vendido */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-sky-500/10">
            <Wallet className="h-10 w-10 text-sky-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              <span className="text-2xl">Bs. </span>{" "}
              {stats.totalAmount.toLocaleString()}
            </p>

            <p className="font-semibold">Total vendido</p>

            <p className="text-sm text-muted-foreground">
              Ingresos obtenidos por las ventas.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Valor de inventario */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-lime-500/10">
            <TrendingUp className="h-10 w-10 text-lime-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              <span className="text-2xl">Bs. </span>{" "}
              {stats.totalProfit.toLocaleString()}
            </p>

            <p className="font-semibold">Ganancia</p>

            <p className="text-sm text-muted-foreground">
              Utilidad generada por productos y servicios.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ticked Promedio */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-amber-500/10">
            <Tags className="h-10 w-10 text-amber-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              <span className="text-2xl">Bs. </span>{" "}
              {stats.averageTicket.toLocaleString()}
            </p>

            <p className="font-semibold">Ticket promedio</p>

            <p className="text-sm text-muted-foreground">
              Promedio de ingresos por cada venta realizada.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
