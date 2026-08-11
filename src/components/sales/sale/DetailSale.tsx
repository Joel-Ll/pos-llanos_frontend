import { useState } from "react";
import { useNavigate } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { SaleDetail } from "@/types/sales/sales.type";
import {
  ArrowLeft,
  Banknote,
  DollarSign,
  FileText,
  Layers2,
  Percent,
  PiggyBank,
  QrCode,
  ShoppingCart,
  TrendingUp,
  X,
} from "lucide-react";
import { formatDate } from "date-fns";
import { formatCurrency } from "@/utils";
import { cn } from "@/lib/utils";
import { CancelSale } from "../CancelSale";

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

interface Props {
  data: SaleDetail;
}

export default function DetailSale({ data }: Props) {
  const navigate = useNavigate();
  const subtProducts = data.items.reduce((acc, i) => i.subtotal + acc, 0);
  const subServices = data.services.reduce((acc, s) => s.amount + acc, 0);
  const [openCancel, setOpenCancel] = useState(false);
  return (
    <>
      <div data-aos="fade-in" className="space-y-8" data-aos-duration="300">
        {/* Header */}
        <Card className="p-0">
          <div className="px-5 py-5">
            <Button
              variant="link"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-5 px-0 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a ventas
            </Button>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Información */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold">{data.code}</h1>

                    {data.status === "registered" ? (
                      <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                        Realizado
                      </Badge>
                    ) : (
                      <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                        Cancelado
                      </Badge>
                    )}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-10 text-sm text-muted-foreground">
                    <div className="flex flex-col gap-0.5">
                      <p>Cliente</p>
                      {data.client.name ? (
                        <p className="font-bold">{data.client.name}</p>
                      ) : (
                        <p className="font-bold">s/n</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <p>NIT/CI</p>
                      {data.client.document ? (
                        <p className="font-bold">{data.client.document}</p>
                      ) : (
                        <p className="font-bold">s/n</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <p>Fecha y Hora</p>
                      <p className="font-bold ">
                        {formatDate(data.createdAt, "Pp")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex w-full flex-col gap-3 md:flex-row  md:w-auto">
                <Button
                  variant="outline"
                  // onClick={() => setOpen(true)}
                  className="w-full md:w-auto"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>

                {data.status === "registered" && (
                  <Button
                    onClick={() => setOpenCancel(true)}
                    className="w-full md:w-auto "
                    variant={"outline"}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar Venta
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Total Venta */}
          <Card className="py-0">
            <CardContent className="flex items-center gap-3 p-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-lime-500/10">
                <DollarSign className="h-10 w-10 text-lime-500" />
              </div>

              <div className="space-y-0.5">
                <p className="font-semibold">Total de la Venta</p>

                <p className="text-2xl font-bold leading-none text-lime-600">
                  Bs. {data.totalAmount.toLocaleString()}
                </p>

                <p className="text-sm text-muted-foreground">
                  Monto total final.
                </p>
              </div>
            </CardContent>
          </Card>

          {/*  Ganancia total */}
          <Card className="py-0">
            <CardContent className="flex items-center gap-5 p-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-sky-500/10">
                <TrendingUp className="h-10 w-10 text-sky-600" />
              </div>

              <div className="space-y-0.5">
                <p className="font-semibold">Ganancia Total</p>

                <p className="text-2xl font-bold leading-none text-sky-600">
                  Bs. {data.totalProfit.toLocaleString()}
                </p>

                <p className="text-sm text-muted-foreground">
                  Productos + Servicios
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Descuentos */}
          <Card className="py-0">
            <CardContent className="flex items-center gap-5 p-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-amber-500/10">
                <Percent className="h-10 w-10 text-amber-500" />
              </div>

              <div className="space-y-0.5">
                <p className="font-semibold">Descuento</p>
                <p className="text-2xl font-bold leading-none text-amber-600">
                  Bs. {data.globalDiscount.toLocaleString()}
                </p>

                <p className="text-sm text-muted-foreground">
                  Descuento aplicado
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Producto y servicios*/}
          <Card className="py-0">
            <CardContent className="flex items-center gap-5 p-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-violet-500/10">
                <Layers2 className="h-10 w-10 text-violet-500" />
              </div>

              <div className="space-y-0.5">
                <p className="font-semibold">Productos / Servicios</p>
                <p className="text-2xl font-bold leading-none text-violet-600">
                  {data.items.length} / {data.services.length}
                </p>

                <p className="text-sm text-muted-foreground">
                  Operaciones registradas.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            {/* Tabla de Productos */}
            <Card>
              <CardContent>
                <p className="font-semibold">Productos vendidos</p>

                <div className="overflow-hidden rounded-md border bg-white shadow-sm mt-5">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="px-5 py-4">Producto</TableHead>
                        <TableHead className="px-5 py-4 text-center">
                          Cant.
                        </TableHead>
                        <TableHead className="px-5 py-4 text-right">
                          Costo Unit.
                        </TableHead>
                        <TableHead className="px-5 py-4 text-right">
                          Precio Unit.
                        </TableHead>
                        <TableHead className="px-5 py-4 text-right">
                          Subtotal
                        </TableHead>
                        <TableHead className="px-5 py-4 text-right">
                          Ganancia
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {data.items.map((item) => (
                        <TableRow key={item.productId}>
                          {/* Producto */}
                          <TableCell className="px-5 py-4">
                            <div>
                              <p className="font-medium">{item.description}</p>

                              <p className="text-xs text-muted-foreground">
                                #{item.internalCode}
                                {item.catalogCode && ` • ${item.catalogCode}`}
                                {" • "}
                                {item.brand}
                              </p>
                            </div>
                          </TableCell>

                          {/* Cantidad */}
                          <TableCell className="px-5 py-4 text-center font-medium">
                            {item.quantity}
                          </TableCell>

                          {/* Costo */}
                          <TableCell className="px-5 py-4 text-right">
                            Bs. {formatCurrency(item.costPrice)}
                          </TableCell>

                          {/* Precio */}
                          <TableCell className="px-5 py-4 text-right">
                            Bs. {formatCurrency(item.unitPrice)}
                          </TableCell>

                          {/* Subtotal */}
                          <TableCell className="px-5 py-4 text-right font-semibold">
                            Bs. {formatCurrency(item.subtotal)}
                          </TableCell>

                          {/* Ganancia */}
                          <TableCell className="px-5 py-4 text-right">
                            <span className="font-semibold text-green-600">
                              Bs. {formatCurrency(item.profit)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-right font-semibold px-5 py-4"
                        >
                          Totales
                        </TableCell>

                        <TableCell className="text-right font-bold px-5 py-4">
                          Bs.{" "}
                          {formatCurrency(
                            data.items.reduce((acc, i) => acc + i.subtotal, 0)
                          )}
                        </TableCell>

                        <TableCell className="text-right font-bold text-green-600 px-5 py-4">
                          Bs.{" "}
                          {formatCurrency(
                            data.items.reduce((acc, i) => acc + i.profit, 0)
                          )}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </CardContent>
            </Card>
            {/* Tabla de Servicios */}
            <Card>
              <CardContent>
                <p className="font-semibold">Servicios realizados</p>

                <div className="overflow-hidden rounded-md border bg-white shadow-sm mt-5">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="px-5 py-4">Servicio</TableHead>
                        <TableHead className="px-5 py-4 text-right w-[100px]">
                          Subtotal
                        </TableHead>
                        <TableHead className="px-5 py-4 text-right w-[100px]">
                          Ganancia
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {data.services.map((service) => (
                        <TableRow key={service._id}>
                          {/* Servicio */}
                          <TableCell className="px-5 py-4">
                            <div>
                              <p className="font-medium">
                                {service.description}
                              </p>
                            </div>
                          </TableCell>

                          {/* Subtotal */}
                          <TableCell className="px-5 py-4 text-right font-semibold">
                            Bs. {formatCurrency(service.amount)}
                          </TableCell>

                          {/* Ganancia */}
                          <TableCell className="px-5 py-4 text-right">
                            <span className="font-semibold text-green-600">
                              Bs. {formatCurrency(service.amount)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell
                          colSpan={1}
                          className="px-5 py-4 text-right font-semibold"
                        >
                          Totales
                        </TableCell>

                        <TableCell className="px-5 py-4 text-right font-bold">
                          Bs.{" "}
                          {formatCurrency(
                            data.services.reduce((acc, i) => acc + i.amount, 0)
                          )}
                        </TableCell>

                        <TableCell className="px-5 py-4 text-right font-bold text-green-600">
                          Bs.{" "}
                          {formatCurrency(
                            data.services.reduce((acc, i) => acc + i.amount, 0)
                          )}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent>
                <CardHeader className="px-2">
                  <CardTitle>Totales</CardTitle>
                </CardHeader>

                {/* Subtotales */}
                <div className="p-2  space-y-2">
                  <Row
                    label="Subtotal Productos"
                    value={`Bs. ${subtProducts.toLocaleString()}`}
                  />
                  <Row
                    label="Subtotal Servicios"
                    value={`Bs. ${subServices.toLocaleString()}`}
                  />

                  <hr className="border-border" />

                  <Row
                    label={
                      <span className="flex items-center gap-1">
                        <Banknote className="w-3 h-3" /> Subtotal
                      </span>
                    }
                    value={`Bs. ${subtProducts + subServices}`}
                  />
                  <Row
                    label={
                      <span className="flex items-center gap-1">
                        <QrCode className="w-3 h-3" /> Descuento
                      </span>
                    }
                    value={`Bs. ${data.globalDiscount.toLocaleString()}`}
                  />
                </div>

                {/* Conciliación */}
                <div className="p-2 space-y-2">
                  <Card className="py-0 bg-emerald-500/10 shadow-none">
                    <CardContent className="flex items-center gap-3 p-6">
                      <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-emerald-500/10">
                        <PiggyBank className="h-10 w-10 text-emerald-500" />
                      </div>

                      <div className="space-y-0.5">
                        <p className="font-semibold">Ganancia Total</p>

                        <p className="text-2xl font-bold leading-none text-emerald-600">
                          Bs. {data.totalProfit.toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CancelSale
        openCancel={openCancel}
        setOpenCancel={setOpenCancel}
        saleId={data._id}
      />
    </>
  );
}
