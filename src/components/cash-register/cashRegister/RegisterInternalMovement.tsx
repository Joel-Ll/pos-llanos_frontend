import { type Dispatch, type SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  registerInternalMovementFormSchema,
  type Cash,
  type RegisterInternalMovementValues,
} from "@/types/cash-register/cash-register.type";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { registerInternalMovementAction } from "@/actions/cash-register/register-internal-movement.action";
import { FullScreenLoader } from "@/components/ui/loader-full-screen";

interface Props {
  cashRegisterId: Cash["_id"];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export const RegisterInternalMovement = ({
  cashRegisterId,
  open,
  setOpen,
}: Props) => {
  const form = useForm<RegisterInternalMovementValues>({
    resolver: zodResolver(registerInternalMovementFormSchema),
    defaultValues: { type: "income", description: "", amount: null },
  });

  const watchedType = form.watch("type");
  const watchedAmount = form.watch("amount");
  const watchedDesc = form.watch("description");
  const isIncome = watchedType === "income";
  const hasPreview =
    !!watchedAmount && watchedAmount > 0 && !!watchedDesc?.trim();

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: registerInternalMovementAction,
    onError: (err: TypeError) => toast.error(err.message),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["cash-register", cashRegisterId],
      });
      toast.success(data);
    },
  });

  const onSubmit = (formData: RegisterInternalMovementValues) => {
    mutate({ cashRegisterId, formData });
    handleClose();
  };

  const handleClose = () => {
    form.reset();
    setOpen(false);
  };

  if (isPending) {
    return <FullScreenLoader text="Registrando..." />;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) handleClose();
      }}
    >
      <DialogContent>
        <DialogHeader className="p-2 pb-4">
          <DialogTitle>Registrar movimiento</DialogTitle>
          <DialogDescription>
            El movimiento afectará directamente el efectivo en caja.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="px-2 pb-4 space-y-4">
            {/* Tipo */}
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Tipo de movimiento</FieldLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        value: "income",
                        label: "Ingreso",
                        icon: <ArrowDownCircle className="w-5 h-5" />,
                      },
                      {
                        value: "expense",
                        label: "Egreso",
                        icon: <ArrowUpCircle className="w-5 h-5" />,
                      },
                    ].map((opt) => {
                      const active = field.value === opt.value;
                      const isInc = opt.value === "income";
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => field.onChange(opt.value)}
                          className={cn(
                            "flex flex-col items-center gap-1.5 p-3 rounded-lg border text-sm transition-colors",
                            active &&
                              isInc &&
                              "border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200 dark:border-green-700 font-medium",
                            active &&
                              !isInc &&
                              "border-red-500 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200 dark:border-red-700 font-medium",
                            !active &&
                              "border-border bg-muted/40 text-muted-foreground"
                          )}
                        >
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              active &&
                                isInc &&
                                "bg-green-200 dark:bg-green-800",
                              active && !isInc && "bg-red-200 dark:bg-red-800",
                              !active && "bg-muted"
                            )}
                          >
                            {opt.icon}
                          </div>
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              )}
            />

            {/* Monto */}
            <Controller
              control={form.control}
              name="amount"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Monto (Bs.)</FieldLabel>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="text-right text-xl font-medium"
                    aria-invalid={fieldState.invalid}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Descripción */}
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Descripción</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    rows={2}
                    placeholder="Ej: Pago de sueldo, reposición de efectivo..."
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Preview */}
            {hasPreview && (
              <div
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm",
                  isIncome
                    ? "bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800"
                    : "bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800"
                )}
              >
                <div>
                  <p
                    className={cn(
                      "font-medium text-xs",
                      isIncome
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    )}
                  >
                    {isIncome ? "Entrada a caja" : "Salida de caja"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[180px]">
                    {watchedDesc}
                  </p>
                </div>
                <span
                  className={cn(
                    "font-semibold text-base",
                    isIncome
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  )}
                >
                  {isIncome ? "+" : "−"} Bs. {watchedAmount?.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <DialogFooter className="px-2 py-4 flex gap-5 justify-baseline">
            <DialogClose asChild>
              <Button
                type="button"
                className="flex-1"
                variant="outline"
                onClick={handleClose}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                isIncome
                  ? "bg-green-700 flex-1 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600"
                  : "bg-red-700 flex-1 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600"
              )}
            >
              {isIncome ? (
                <ArrowDownCircle className="w-4 h-4" />
              ) : (
                <ArrowUpCircle className="w-4 h-4" />
              )}
              {isIncome ? "Registrar ingreso" : "Registrar egreso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
