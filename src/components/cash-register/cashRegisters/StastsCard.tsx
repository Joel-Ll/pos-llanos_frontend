import { Wallet, TrendingUp, TrendingDown, BadgePercent } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CashStats } from "@/types/cash-register/cash-register.type";
import { formatCurrency } from "@/utils";

interface Props {
  stats: CashStats;
}

export const StatsCard = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {/* Total cajas registradas */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-3 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10">
            <Wallet className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.totalRegisters}
            </p>

            <p className="font-semibold">Total cajas</p>

            <p className="text-sm text-muted-foreground">
              Sesiones de caja registradas.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Total Ingresos */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-lime-500/10">
            <TrendingUp className="h-10 w-10 text-lime-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              <span className="text-2xl">Bs. </span>{" "}
              {formatCurrency(stats.totalIncome)}
            </p>

            <p className="font-semibold">Total ingresos</p>

            <p className="text-sm text-muted-foreground">
              Ventas e ingresos acumulados.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Total Egresos */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-red-500/10">
            <TrendingDown className="h-10 w-10 text-red-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              <span className="text-2xl">Bs. </span>{" "}
              {formatCurrency(stats.totalExpense)}
            </p>

            <p className="font-semibold">Total egresos</p>

            <p className="text-sm text-muted-foreground">
              Salidas de efectivo registradas.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Descuentos */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-amber-500/10">
            <BadgePercent className="h-10 w-10 text-amber-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              <span className="text-2xl">Bs. </span>{" "}
              {formatCurrency(stats.totalDiscounts)}
            </p>

            <p className="font-semibold">Descuentos</p>

            <p className="text-sm text-muted-foreground">
              Descuentos acumulados.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
