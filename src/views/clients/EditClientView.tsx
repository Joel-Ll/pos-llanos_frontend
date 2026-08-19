import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  clientFormSchema,
  typeClient,
  typeDocument,
  type ClientFormValues,
} from "@/types/clients/clients.type";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { getClientAction } from "@/actions/clients/get-client.action";
import { editClientAction } from "@/actions/clients/edit-client.action";
import { Spinner } from "@/components/ui/spinner";

export default function EditClientView() {
  const params = useParams();
  const navigate = useNavigate();
  const clientId = params.clientId!;

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      razonSocial: "",
      typeClient: "",
      tipoDocumento: "",
      documentoId: "",
      phone: "",
      email: "",
    },
  });

  const { data, refetch } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClientAction(clientId),
    enabled: !!clientId,
    retry: false,
  });

  useEffect(() => {
    if (clientId) {
      refetch();
    }
  }, [clientId, refetch]);

  useEffect(() => {
    if (data) {
      const resetData = {
        razonSocial: data.razonSocial,
        typeClient: data.typeClient,
        tipoDocumento: data.tipoDocumento,
        documentoId: data.documentoId,
        phone: data.phone,
        email: data.email,
      };
      setTimeout(() => {
        form.reset(resetData);
      }, 0);
    }
  }, [data]);

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: editClientAction,
    onError: (error: TypeError) => {
      toast.error(error.message);
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["client", clientId] });
      await queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success(data);
      // handleClose();
    },
  });

  const onSubmit = (formData: ClientFormValues) => {
    mutate({ clientId, formData });
    handleClose();
  };

  const handleClose = () => {
    form.reset();
    navigate(-1);
  };

  return (
    <div data-aos="fade-in" data-aos-duration="300">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl lg:text-3xl">
            Editar Cliente
          </CardTitle>
          <CardDescription>
            Ingrese los nuevos datos del cliente
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 🧑 DATOS PRINCIPALES */}
            <div className="rounded-lg border p-4 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                Datos del Cliente
              </div>

              <div className="grid gap-4">
                {/* Nombre grande */}
                <div>
                  <Controller
                    control={form.control}
                    name="razonSocial"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Nombre / Razón Social</FieldLabel>
                        <Input
                          {...field}
                          placeholder="Ej. Juan Pérez / Empresa S.R.L."
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Tipo Cliente */}
                  <Controller
                    name="typeClient"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Tipo Cliente *</FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                          <SelectContent>
                            {typeClient?.map((item) => (
                              <SelectItem key={item.id} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* 📄 DOCUMENTO */}
            <div className="rounded-lg border p-4 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                Documento
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Tipo Documento */}
                <Controller
                  name="tipoDocumento"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Tipo Documento *</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          {typeDocument?.map((item) => (
                            <SelectItem key={item.id} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Número */}
                <Controller
                  control={form.control}
                  name="documentoId"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Nro Documento *</FieldLabel>
                      <Input {...field} placeholder="Ej. 723..." />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>

            {/* 📞 CONTACTO */}
            <div className="rounded-lg border p-4 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                Contacto
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Teléfono */}
                <Controller
                  control={form.control}
                  name="phone"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Teléfono</FieldLabel>
                      <Input {...field} placeholder="Ej. 7254..." />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Email */}
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Email</FieldLabel>
                      <Input {...field} placeholder="cliente@email.com" />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>

            {/* 🚀 FOOTER */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose()}
              >
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
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
