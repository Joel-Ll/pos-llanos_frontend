import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import type { Adjustment } from "@/types/adjustments/adjustments.type";
import { DetailAdjustment } from "./DetailAdjustment";
import { formatDate } from "@/utils";

interface Props {
  isLoading: boolean;
  data: Adjustment[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const AdjustmentsHistory = ({
  isLoading,
  data,
  page,
  totalPages,
  onPageChange,
}: Props) => {
  const [openView, setOpenView] = useState(false);
  const [adjustmentId, setAdjustmentId] = useState("");

  const getPages = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);

    if (page > 3) pages.push("ellipsis");

    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }

    if (page < totalPages - 2) pages.push("ellipsis");

    pages.push(totalPages);

    return pages;
  };

  const handleView = (id: string) => {
    setAdjustmentId(id);
    setOpenView(true);
  };

  return (
    <>
      <Card className="my-10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Historial de Ajustes</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Cantidad</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No hay ajustes registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((adj) => (
                      <TableRow key={adj._id}>
                        <TableCell className="text-sm">
                          {formatDate(new Date(adj.createdAt))}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">
                              {adj.product.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              #{adj.product.internalCode} •{" "}
                              {adj.product.catalogCode}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={"outline"}>{adj.product.brand}</Badge>
                        </TableCell>
                        <TableCell>
                          <>
                            {adj.adjustmentType === "increment" ? (
                              <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                                Incremento
                              </Badge>
                            ) : (
                              <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                                Reducción
                              </Badge>
                            )}
                          </>
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          <span
                            className={
                              adj.adjustmentType === "increment"
                                ? "text-sky-600"
                                : "text-red-600"
                            }
                          >
                            {adj.adjustmentType === "increment" ? "+" : "-"}
                            {adj.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{adj.reason}</TableCell>
                        <TableCell className="text-center text-sm">
                          <span className="text-muted-foreground">
                            {adj.previousStock}
                          </span>
                          {" → "}
                          <span className="font-semibold">{adj.newStock}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(adj._id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </>
              )}
            </TableBody>
          </Table>

          {/* Paginación shadcn */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => onPageChange(page - 1)}
                      className={
                        page === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {getPages().map((p, i) => (
                    <PaginationItem key={i}>
                      {p === "ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          isActive={p === page}
                          onClick={() => onPageChange(p)}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => onPageChange(page + 1)}
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <DetailAdjustment
        openView={openView}
        setOpenView={setOpenView}
        adjustmentId={adjustmentId}
        setAdjustmentId={setAdjustmentId}
      />
    </>
  );
};
