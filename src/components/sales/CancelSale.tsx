import type { Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { SaleComun } from "@/types/sales/sales.type";
import { cancelSaleAction } from "@/actions/sales/cancel-sale.action";
import { FullScreenLoader } from "../ui/loader-full-screen";

interface Props {
  openCancel: boolean;
  setOpenCancel: Dispatch<SetStateAction<boolean>>;
  saleId: SaleComun["_id"];
}

export const CancelSale = ({ openCancel, setOpenCancel, saleId }: Props) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: cancelSaleAction,
    onError: (error: TypeError) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sale", saleId] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      toast.success(data);
    },
  });

  if (isPending) {
    return <FullScreenLoader text="Cancelando" />;
  }

  return (
    <AlertDialog
      open={openCancel}
      onOpenChange={(isOpen) => {
        setOpenCancel(isOpen);
      }}
    >
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar Venta</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro de cancelar esta venta? Esta acción no se puede
            deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant={"destructive"}
            disabled={isPending}
            onClick={() => mutate(saleId)}
          >
            Aceptar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
