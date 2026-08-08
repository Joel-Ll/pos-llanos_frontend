import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";

import { loginFormSchema } from "@/types/auth/auth.types";
import { authenticateAction } from "@/actions/auth/authenticate.action";
import ErrorMessage from "../utils/error-message";
import { useSidebarStore } from "@/store/sidebar.store";

export default function LoginForm() {
  const { handleItemClick } = useSidebarStore();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authenticateAction,
    onError: (err: TypeError) => {
      setError(err.message);
      form.reset();
      setTimeout(() => {
        setError("");
      }, 3000);
    },
    onSuccess: () => {
      handleItemClick("Inicio");
      navigate("/home");
    },
  });

  const onSubmit = (formData: z.infer<typeof loginFormSchema>) => {
    mutate(formData);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex justify-center">
            <img
              src="/logo4.png"
              alt="Lubricantes y Autopartes Rosario"
              className="h-40 w-auto object-contain"
            />
          </div>

          <div className="text-center">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>

            <CardDescription>Ingrese su usuario y contraseña</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usuario</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Juan"
                          required
                          autoComplete="username"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => {
                    const [showPassword, setShowPassword] = useState(false);

                    return (
                      <FormItem className="flex flex-col space-y-1.5">
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-sm">Contraseña</FormLabel>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 cursor-pointer"
                          >
                            {showPassword ? (
                              <>
                                <EyeOff className="h-4 w-4" />
                                Ocultar
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4" />
                                Mostrar
                              </>
                            )}
                          </button>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              required
                              type={showPassword ? "text" : "password"}
                              autoComplete="current-password"
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />

                {isPending && (
                  <div className="flex items-center justify-center gap-4">
                    <Spinner className="size-6" />
                  </div>
                )}

                <Field>
                  <Button
                    className="cursor-pointer"
                    type="submit"
                    disabled={isPending}
                  >
                    Ingresar
                  </Button>
                </Field>
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
