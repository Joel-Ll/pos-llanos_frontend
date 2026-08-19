import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Unlock } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  cashRegisterFormSchema,
  type CashRegisterFormValues,
} from "@/types/cash-register/cash-register.type";
import { createCashAction } from "@/actions/cash-register/create-cash.action";
import { Spinner } from "../ui/spinner";

export default function AddCashRegister() {
  const [open, setOpen] = useState(false);
  const form = useForm<CashRegisterFormValues>({
    resolver: zodResolver(cashRegisterFormSchema),
    defaultValues: {
      user: "",
      transactions: [
        {
          method: "cash",
          amount: null,
        },
      ],
    },
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createCashAction,
    onError: (err: TypeError) => {
      toast.error(err.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cash-all"] });
      toast.success(data);
    },
  });

  const onSubmit = (formData: CashRegisterFormValues) => {
    mutate(formData);
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2 w-52" onClick={() => setOpen(true)}>
          <Plus className="h-5 w-5" />
          Abrir Caja
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Unlock className="h-5 w-5 text-emerald-500" />
            Abrir Nueva Caja
          </DialogTitle>
          <DialogDescription>
            Registre el monto efectivo inicial con el que se abre la caja.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 md:space-y-4"
        >
          <Controller
            control={form.control}
            name="user"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Responsable</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Juan Perez"
                  autoComplete="off"
                  className="bg-secondary/50"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="transactions.0.amount"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Monto Apertura</FieldLabel>
                <Input
                  placeholder="0"
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                  aria-invalid={fieldState.invalid}
                  className="bg-secondary/50"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Cargando...
                </>
              ) : (
                "Aceptar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
