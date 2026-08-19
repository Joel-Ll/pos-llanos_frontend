import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, QrCode, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Cash } from "@/types/cash-register/cash-register.type";
import { formatCurrency } from "@/utils";

interface Props {
  cashRegister: Cash;
}

const Row = ({
  label,
  value,
  valueClass,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  valueClass?: string;
}) => (
  <div className="flex items-center justify-between text-xs">
    <span className="text-muted-foreground">{label}</span>
    <span className={cn("text-sm font-semibold", valueClass)}>{value}</span>
  </div>
);

export const CashRegisterInfoCard = ({ cashRegister: cr }: Props) => {
  return (
    <Card className="sticky top-4">
      <CardContent>
        <CardHeader className="px-2">
          <CardTitle>Resumen de Caja</CardTitle>
        </CardHeader>

        {/* Movimientos */}
        <div className="p-2 border-b space-y-2">
          <Row
            label="Monto apertura"
            value={`Bs. ${formatCurrency(cr.initialAmount)}`}
          />
          <Row
            label="(+) Total ventas"
            value={`Bs. ${formatCurrency(cr.totalSales)}`}
          />
          <Row
            label="(-) Descuentos"
            value={`Bs. ${formatCurrency(cr.totalDiscounts)}`}
            valueClass="text-destructive"
          />

          <hr className="border-border" />

          <Row
            label={
              <span className="flex items-center gap-1">
                <Banknote className="w-3 h-3" /> Efectivo
              </span>
            }
            value={`Bs. ${formatCurrency(cr.cashIncome)}`}
          />
          <Row
            label={
              <span className="flex items-center gap-1">
                <QrCode className="w-3 h-3" /> QR
              </span>
            }
            value={`Bs. ${formatCurrency(cr.qrIncome)}`}
          />
          <Row
            label={
              <span className="flex items-center gap-1">
                <ArrowDownCircle className="w-3 h-3" /> Ing. manual
              </span>
            }
            value={`+ Bs. ${formatCurrency(cr.manualIncome)}`}
            valueClass="text-emerald-600 dark:text-emerald-400"
          />
          <Row
            label={
              <span className="flex items-center gap-1">
                <ArrowUpCircle className="w-3 h-3" /> Egr. manual
              </span>
            }
            value={`− Bs. ${formatCurrency(cr.manualExpense)}`}
            valueClass="text-destructive"
          />
          <Row
            label="Movimientos"
            value={
              <Badge variant="secondary" className="text-xs">
                {cr.totalMovements}
              </Badge>
            }
          />
        </div>

        {/* Conciliación */}
        <div className="p-2 space-y-2">
          <Row
            label="Esperado en caja"
            value={`Bs. ${formatCurrency(cr.expectedAmount)}`}
            valueClass="font-medium"
          />
          <Row
            label="Contado"
            value={
              cr.countedAmount > 0
                ? `Bs. ${formatCurrency(cr.countedAmount)}`
                : "—"
            }
            valueClass={
              cr.countedAmount > 0 ? "font-medium" : "text-muted-foreground"
            }
          />
          <Row
            label="Diferencia"
            value={
              cr.countedAmount > 0
                ? `Bs. ${formatCurrency(cr.difference)}`
                : "—"
            }
            valueClass={cn(
              cr.difference === 0 && "text-emerald-600 dark:text-emerald-400",
              cr.difference !== 0 && cr.countedAmount > 0 && "text-destructive",
              cr.countedAmount === 0 && "text-muted-foreground"
            )}
          />
          {cr.closingNote && (
            <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2 mt-2">
              {cr.closingNote}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
