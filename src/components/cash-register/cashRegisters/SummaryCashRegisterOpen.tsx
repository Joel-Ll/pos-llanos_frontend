import { useNavigate } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CurrectCash } from "@/types/cash-register/cash-register.type";
import { format } from "date-fns";
import { formatCurrency } from "@/utils";

interface Props {
  currentCash: CurrectCash;
}

export default function SummaryCashRegisterOpen({ currentCash }: Props) {
  const navigate = useNavigate();
  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Caja abierta</CardTitle>
            <CardDescription>Información de la sesión actual</CardDescription>
          </div>

          <Badge variant="default">Abierta</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Código */}
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Código</p>
          <p className="text-lg font-bold">{currentCash?.code}</p>
        </div>

        {/* Usuario */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Usuario</span>

          <span className="font-medium">{currentCash?.user}</span>
        </div>

        {/* Fecha apertura */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Apertura</span>

          <span className="font-medium">
            {format(currentCash?.openedAt || new Date(), "dd/MM/yyyy HH:mm")}
          </span>
        </div>

        <Separator />

        {/* Monto inicial */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Monto inicial</span>

          <span className="font-semibold">
            Bs. {formatCurrency(currentCash?.initialAmount ?? 0)}
          </span>
        </div>

        {/* Esperado */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Monto esperado</span>

          <span className="text-lg font-bold text-primary">
            Bs {formatCurrency(currentCash?.expectedAmount ?? 0)}
          </span>
        </div>

        <Button
          className="w-full"
          onClick={() => navigate(`/cash-register/detail/${currentCash?._id}`)}
        >
          Ver caja
        </Button>
      </CardContent>
    </Card>
  );
}
