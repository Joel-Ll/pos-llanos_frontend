import { Box, CheckCircle2, PackageX, Tags } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CategoriesStats } from "@/types/categories/categories.types";

interface Props {
  stats: CategoriesStats;
}

export const StatsCard = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {/* Total categorías */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-3 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10">
            <Box className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.totalCategories}
            </p>

            <p className="font-semibold">Total categorías</p>

            <p className="text-sm text-muted-foreground">
              Todas las categorías registradas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Categorías activas */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-lime-500/10">
            <CheckCircle2 className="h-10 w-10 text-lime-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.totalCategoriesActive}
            </p>

            <p className="font-semibold">Categorías activas</p>

            <p className="text-sm text-muted-foreground">En uso actualmente</p>
          </div>
        </CardContent>
      </Card>

      {/* Categorías sin productos */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-amber-500/10">
            <PackageX className="h-10 w-10 text-amber-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.totalCategoriesEmpty}
            </p>

            <p className="font-semibold">Categoría sin productos</p>

            <p className="text-sm text-muted-foreground">
              Aún no tienen productos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Valor de inventario */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-violet-500/10">
            <Tags className="h-10 w-10 text-violet-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              <span className="text-2xl">Bs. </span>{" "}
              {stats.totalInventoryValue.toLocaleString()}
            </p>

            <p className="font-semibold">Valor inventario</p>

            <p className="text-sm text-muted-foreground">
              Costo estimado del stock
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
