import { ShoppingCart, FilePen, ClipboardCheck, BookmarkX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { PurchaseStats } from "@/types/purchases/purchases-type";
import { formatCurrency } from "@/utils";

interface Props {
  stats: PurchaseStats;
}

export const StatsCard = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {/* Todos los registros */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-3 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10">
            <FilePen className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.totalPurchases}
            </p>

            <p className="font-semibold">Total registros</p>

            <p className="text-sm text-muted-foreground">
              todas las compras registradas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Compras realizadas */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-lime-500/10">
            <ClipboardCheck className="h-10 w-10 text-lime-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.totalPurchased}
            </p>

            <p className="font-semibold">Compras realizadas</p>

            <p className="text-sm text-muted-foreground">
              todas las compras realizadas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Compras anuladas */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-amber-500/10">
            <BookmarkX className="h-10 w-10 text-amber-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.totalCancelled}
            </p>

            <p className="font-semibold">Compras anuladas</p>

            <p className="text-sm text-muted-foreground">
              todas las compras anuladas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Total comprado */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-violet-500/10">
            <ShoppingCart className="h-10 w-10 text-violet-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              <span className="text-2xl">Bs. </span>{" "}
              {formatCurrency(stats.totalAmount)}
            </p>

            <p className="font-semibold">Total comprado</p>

            <p className="text-sm text-muted-foreground">
              Costo estimado de las compras
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
