import { useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

import type { SalesFormValues } from "@/types/sales/sales.type";
import { Plus, Wrench } from "lucide-react";
import { generateUniqueId } from "@/utils";

interface Props {
  setValue: UseFormSetValue<SalesFormValues>;
  services: {
    description: string;
    amount: number;
    id: number;
  }[];
  amountServices: number;
}

export default function CardServices({ setValue, services }: Props) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const addService = () => {
    if (!description.trim()) return;
    const numericAmount = Number(amount);
    if (numericAmount <= 0) return;

    const newService = {
      description,
      amount: numericAmount,
      id: generateUniqueId(),
    };

    setValue("services", [...services, newService], {
      shouldValidate: true,
    });

    setDescription("");
    setAmount("");
  };

  return (
    <Card className="flex gap-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wrench className="h-5 w-5 text-primary" />
          2. Servicios
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
          <Field className="sm:col-span-3">
            <FieldLabel htmlFor="service-description">Descripción</FieldLabel>
            <Input
              id="service-description"
              placeholder="Mantenimiento..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>

          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="service-amount">Monto</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="service-amount"
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <InputGroupAddon>
                <InputGroupText>Bs.</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <Button
            type="button"
            onClick={addService}
            className="h-10 sm:self-end"
          >
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
