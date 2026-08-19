import { useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowLeft,
  DollarSign,
  Edit2,
  LayoutGrid,
  MoreVertical,
  Package,
  PlusCircle,
  XCircle,
} from "lucide-react";

import type { CategoryWithProducts } from "@/types/categories/categories.types";
import { DataTable } from "./category/data-table";
import { columns } from "./category/columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditCategory from "./EditCategory";
import { formatCurrency } from "@/utils";

interface Props {
  data: CategoryWithProducts;
}

export const DetailCategory = ({ data }: Props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div data-aos="fade-in" data-aos-duration="300">
        {/* Header */}
        <Card className="p-0">
          <div className="container mx-auto px-4 py-4">
            <Button
              variant="link"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver a categorías
            </Button>

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <LayoutGrid className="h-7 w-7 text-primary" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <h1 className="text-2xl font-bold text-foreground md:text-3xl wrap-break-word">
                      {data.category.name}
                    </h1>

                    <Badge
                      className="w-fit"
                      variant={data.category.isActive ? "default" : "secondary"}
                    >
                      {data.category.isActive ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>

                  <p className="mt-1 wrap-break-word text-muted-foreground">
                    {data.category.description}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      disabled={!data.category.isActive}
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-7 w-7" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                      <Edit2 />
                      Editar Categoría
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => navigate("new-product")}>
                      <PlusCircle />
                      Agregar Producto
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </Card>

        {/* STATS */}
        <div className="container mx-auto py-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <Card className="py-0">
              <CardContent className="flex items-center gap-3 p-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10">
                  <Package className="h-10 w-10 text-primary" />
                </div>

                <div className="space-y-0.5">
                  <p className="text-3xl font-bold leading-none">
                    {data.stats.totalProducts}
                  </p>
                  <p className="font-semibold">Productos</p>
                  <p className="text-sm text-muted-foreground">
                    en esta categoría
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="py-0">
              <CardContent className="flex items-center gap-5 p-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-orange-500/10">
                  <AlertTriangle className="h-10 w-10 text-orange-500" />
                </div>

                <div className="space-y-0.5">
                  <p className="text-3xl font-bold leading-none">
                    {data.stats.lowStockCount}
                  </p>

                  <p className="font-semibold">Productos</p>

                  <p className="text-sm text-muted-foreground">
                    con bajo stock
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="py-0">
              <CardContent className="flex items-center gap-5 p-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-destructive/10">
                  <XCircle className="h-10 w-10 text-destructive" />
                </div>

                <div className="space-y-0.5">
                  <p className="text-3xl font-bold leading-none">
                    {data.stats.outOfStockCount}
                  </p>

                  <p className="font-semibold">Productos</p>

                  <p className="text-sm text-muted-foreground">sin stock</p>
                </div>
              </CardContent>
            </Card>

            <Card className="py-0">
              <CardContent className="flex items-center gap-5 p-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-violet-500/10">
                  <DollarSign className="h-10 w-10 text-violet-500" />
                </div>

                <div className="space-y-0.5">
                  <p className="text-3xl font-bold leading-none">
                    <span className="text-2xl">Bs. </span>{" "}
                    {formatCurrency(data.stats.inventoryValue)}
                  </p>

                  <p className="font-semibold">Valor inventario</p>

                  <p className="text-sm text-muted-foreground">
                    costo estimado
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data table */}
          <DataTable columns={columns} data={data.products} />
        </div>
      </div>

      <EditCategory
        open={open}
        setOpen={setOpen}
        categoryId={data.category._id}
        categoryObj={data.category}
      />
    </>
  );
};
