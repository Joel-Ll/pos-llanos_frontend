import { Wallet, BadgePercent, Banknote, QrCode } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { StatCash } from "@/types/cash-register/cash-register.type";
import { formatCurrency } from "@/utils";

interface Props {
  stats: StatCash;
}

export const StatsCard = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {/* Total ingresos */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-3 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-lime-500/10">
            <Wallet className="h-10 w-10 text-lime-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-sm text-muted-foreground">Total ingresos</p>

            <p className="text-2xl font-bold leading-none">
              Bs. {formatCurrency(stats.totalIncome)}
            </p>

            <p className="text-sm text-muted-foreground">
              Dinero ingresado a la caja.
            </p>
          </div>
        </CardContent>
      </Card>

      {/*  Ingresos en efectivo */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-sky-500/10">
            <Banknote className="h-10 w-10 text-sky-600" />
          </div>

          <div className="space-y-0.5">
            <p className="text-sm text-muted-foreground">Efectivo</p>

            <p className="text-2xl font-bold leading-none text-sky-600">
              Bs. {formatCurrency(stats.cashIncome)}
            </p>

            <p className="text-sm text-muted-foreground">
              Recibido en efectivo.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ingresos en Qr */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-violet-500/10">
            <QrCode className="h-10 w-10 text-violet-500" />
          </div>

          <div className="space-y-0.5">
            <p className="font-semibold">QR</p>
            <p className="text-2xl font-bold leading-none text-violet-600">
              Bs. {formatCurrency(stats.qrIncome)}
            </p>
            <p className="text-sm text-muted-foreground">Recibido en QR.</p>
          </div>
        </CardContent>
      </Card>

      {/* Operaciones registradas */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-amber-500/10">
            <BadgePercent className="h-10 w-10 text-amber-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-sm text-muted-foreground">Movimientos</p>
            <p className="text-2xl font-bold leading-none text-amber-600">
              {stats.totalMovements}
            </p>

            <p className="text-sm text-muted-foreground">
              Operaciones registradas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
