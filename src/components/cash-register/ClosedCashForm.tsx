import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  closedCashRegisterFormSchema,
  type Cash,
  type ClosedCashRegisterFormValues,
} from "@/types/cash-register/cash-register.type";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { closedCashAction } from "@/actions/cash-register/closed-cash.action";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  Lock,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

const estadoStyles = {
  exacto: {
    bg: "bg-lime-50 border-lime-200",
    text: "text-emerald-700",
    icon: CheckCircle2,
    label: "Cuadre exacto",
    desc: "El monto real coincide con el esperado.",
  },
  faltante: {
    bg: "bg-rose-50 border-rose-200",
    text: "text-rose-700",
    icon: AlertCircle,
    label: "Faltante",
    desc: "El monto real es menor al esperado.",
  },
  sobrante: {
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    icon: AlertTriangle,
    label: "Sobrante",
    desc: "El monto real supera al esperado.",
  },
};

interface Props {
  data: Cash;
}

export const ClosedCashForm = ({ data }: Props) => {
  const params = useParams();
  const cashRegisterId = params.cashRegisterId!;
  const navigate = useNavigate();

  const form = useForm<ClosedCashRegisterFormValues>({
    resolver: zodResolver(closedCashRegisterFormSchema),
    defaultValues: {
      countedAmount: null,
      closingNote: "",
    },
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: closedCashAction,
    onError: (error: TypeError) => {
      toast.error(error.message);
    },
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["cash-all"] });
      queryClient.invalidateQueries({ queryKey: ["cash-register", data._id] });
      toast.success(msg);
      navigate("/cash-register");
    },
  });

  const countedAmount = form.watch("countedAmount");

  const difference = useMemo(() => {
    if (countedAmount === null) return null;
    return countedAmount - data.expectedAmount;
  }, [countedAmount]);

  const state = useMemo(() => {
    if (difference === null) return null;
    if (difference === 0) return "exacto" as const;
    if (difference < 0) return "faltante" as const;
    return "sobrante" as const;
  }, [countedAmount]);

  const onSubmit = (formData: ClosedCashRegisterFormValues) => {
    const params = { cashRegisterId, formData };
    mutate(params);
  };

  const card = state ? estadoStyles[state] : null;
  const CardIcon = card?.icon;

  return (
    <div data-aos="fade-in" data-aos-duration="300">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Monto Inicial */}
          <Card className="py-0">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Wallet className="h-4 w-4" />
                Monto Inicial
              </div>
              <p className="text-3xl font-bold">
                Bs {data.initialAmount.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Apertura del turno
              </p>
            </CardContent>
          </Card>

          {/* Monto Esperado */}
          <Card className="py-0">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <CircleDollarSign className="h-4 w-4" />
                Monto Esperado
              </div>
              <p className="text-3xl font-bold text-primary">
                Bs {data.expectedAmount.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Monto acumulado en efectivo
              </p>
            </CardContent>
          </Card>

          {/* Monto Real */}
          <Card className="py-0">
            <CardContent className="p-5">
              <Controller
                control={form.control}
                name="countedAmount"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Monto Real en Caja *
                    </FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                        Bs
                      </span>
                      <Input
                        id={field.name}
                        type="number"
                        min="0"
                        step="0.01"
                        autoFocus
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                        aria-invalid={fieldState.invalid}
                        placeholder="0.00"
                        className="pl-10 text-2xl h-14 font-bold"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Conteo físico del efectivo
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Diferencia */}
        {card && CardIcon && difference !== null && (
          <Card className={`border-2 ${card.bg}`}>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full bg-white/60 ${card.text}`}>
                  <CardIcon className="h-7 w-7" />
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold uppercase tracking-wide ${card.text}`}
                  >
                    {card.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{card.desc}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase">
                  Diferencia
                </p>
                <p className={`text-3xl font-bold ${card.text}`}>
                  {difference > 0 ? "+" : ""}Bs {difference.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent>
            <Controller
              control={form.control}
              name="closingNote"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Nota de cierre (opcional)
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Ej. Faltante por vuelto entregado, observaciones del turno..."
                    autoComplete="off"
                    className="bg-secondary/50"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigate(-1)} type="button">
            Cancelar
          </Button>
          <Button type="submit" className="gap-2">
            <Lock className="h-4 w-4" />
            Cerrar Caja
          </Button>
        </div>
      </form>
    </div>
  );
};
