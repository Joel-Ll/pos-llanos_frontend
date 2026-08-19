import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClients } from "@/hooks/useClients";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { filterWithCategoryAction } from "@/actions/products/filter-with-category.action";
import { registerSaleAction } from "@/actions/sales/create-sale.action";
import { generateQuotationAction } from "@/actions/reports/quotation-report.action";

import { type Client } from "@/types/clients/clients.type";
import type { CashOpen } from "@/types/cash-register/cash-register.type";
import {
  salesFormSchema,
  type Sale,
  type SalesFormValues,
} from "@/types/sales/sales.type";
import {
  ArrowRight,
  ArrowRightLeft,
  Banknote,
  ChevronDown,
  CreditCard,
  FileDownIcon,
  ListCheck,
  Package,
  Printer,
  QrCode,
  Search,
  ShoppingCart,
  Tag,
  Trash,
  User,
  UserCheck,
  UserPlus,
} from "lucide-react";

import TabsCategories from "./TabsCategories";
import ProductItem from "./ProductItem";
import CardServices from "./CardServices";
import ItemsEmpty from "./ItemsEmpty";
import ProductSaleItem from "./ProductSaleItem";
import ServiceItem from "./ServiceItem";
import SaleSummary from "./SaleSummary";
import { printTicketAction } from "@/actions/printer-ticked/printTicketAction";
import { Spinner } from "../ui/spinner";

interface TransactionMethods {
  method: "cash" | "qr";
  amount: number;
}

interface Props {
  cashRegOpen: CashOpen;
}

type ClientType = "registered" | "quick";

type DiscountType = "bs" | "%";

const paymentMethods = [
  { value: "cash", label: "Efectivo", icon: Banknote },
  { value: "qr", label: "QR", icon: QrCode },
  { value: "mixed", label: "Múltiple", icon: ArrowRightLeft },
];

export default function SalesForm({ cashRegOpen }: Props) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tab, setTab] = useState("detail-sale");

  const [clientType, setClientType] = useState<ClientType>("quick");
  const [saleData, setSaleData] = useState<Sale | undefined>(undefined);
  const [discountType, setDiscountType] = useState<DiscountType>("bs");
  const [discountAmount, setDiscountAmount] = useState<number | undefined>(
    undefined
  );

  const [openSuccess, setOpenSuccess] = useState(false);
  const [clientSearch, setClientSearch] = useState(false);
  const [metodoPago, setMetodoPago] = useState("cash");
  const [cashAmount, setCashAmount] = useState<number | undefined>(undefined);
  const [qrAmount, setQrAmount] = useState(0);
  const { data: listClients } = useClients();

  const defaultValues = {
    client: {
      clientId: "",
      name: "",
      document: "",
    },
    cashRegisterId: cashRegOpen._id,
    items: [],
    services: [],
    transactions: [],
    totalAmount: 0,
    globalDiscount: 0,
    notes: "",
  };

  const form = useForm<SalesFormValues>({
    resolver: zodResolver(salesFormSchema),
    defaultValues,
  });

  const { data: ProductsCatalog, refetch } = useQuery({
    queryKey: ["products-catalog"],
    queryFn: () => filterWithCategoryAction(categoryFilter),
    retry: false,
  });

  const client = form.watch("client");
  const items = form.watch("items");
  const services = form.watch("services");
  const amountProducts = items.reduce((sum, i) => sum + i.subtotal, 0);
  const amountServices = services.reduce((sum, i) => sum + i.amount, 0);

  const calculateGlobalDiscount = (
    total: number,
    type: DiscountType,
    value: number
  ) => {
    if (value <= 0) return 0;

    if (type === "bs") {
      return Math.min(value, total);
    } else {
      const percentage = Math.min(value, 100);
      const discount = (total * percentage) / 100;
      return Math.round(discount);
    }
  };

  const handleDiscountAmount = (value: string | number) => {
    if (value === "" || value === null || value === undefined) {
      setDiscountAmount(undefined);
      form.setValue("globalDiscount", 0);
      return;
    }
    const numericValue = Number(value);
    if (isNaN(numericValue)) {
      return;
    }
    setDiscountAmount(numericValue);
  };

  const handleCashChange = (value: string) => {
    if (value === "" || value === null || value === undefined) {
      setCashAmount(undefined);
      setQrAmount(totalAmount);
      return;
    }

    const numericValue = Number(value);
    if (isNaN(numericValue)) return;
    if (numericValue > totalAmount) return;

    const cash = Math.max(0, numericValue);
    const qr = Math.max(0, totalAmount - cash);

    setCashAmount(cash);
    setQrAmount(qr);
  };

  const globalDiscount = useMemo(() => {
    if (!discountAmount) return 0;

    const applyDiscount = calculateGlobalDiscount(
      amountProducts + amountServices,
      discountType,
      discountAmount
    );
    form.setValue("globalDiscount", applyDiscount);
    return applyDiscount;
  }, [amountProducts, amountServices, discountAmount, discountType]);

  const totalAmount = amountProducts + amountServices - globalDiscount;

  useEffect(() => {
    form.setValue("totalAmount", totalAmount);
  }, [totalAmount]);

  useEffect(() => {
    refetch();
  }, [categoryFilter]);

  useEffect(() => {
    if (metodoPago === "cash") {
      setCashAmount(totalAmount);
      setQrAmount(0);
    }

    if (metodoPago === "qr") {
      setCashAmount(0);
      setQrAmount(totalAmount);
    }
  }, [metodoPago, totalAmount]);

  useEffect(() => {
    let transactions: TransactionMethods[] = [];

    if (metodoPago === "cash")
      transactions = [{ method: "cash", amount: totalAmount }];

    if (metodoPago === "qr")
      transactions = [{ method: "qr", amount: totalAmount }];

    if (metodoPago === "mixed") {
      transactions = [];

      if (cashAmount && cashAmount > 0)
        transactions.push({ method: "cash", amount: cashAmount });

      if (qrAmount > 0) transactions.push({ method: "qr", amount: qrAmount });
    }

    form.setValue("transactions", transactions, { shouldValidate: true });
  }, [metodoPago, cashAmount, qrAmount, totalAmount]);

  const filteredProducts = useMemo(() => {
    return ProductsCatalog?.filter((product) => {
      // filtro categoría
      const matchCategory =
        categoryFilter === "all" ? true : product.category === categoryFilter;

      // búsqueda
      const query = search.toLowerCase();

      const matchSearch =
        product.description.toLowerCase().includes(query) ||
        product.internalCode.toLowerCase().includes(query) ||
        product.catalogCode.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query);

      return matchCategory && matchSearch;
    });
  }, [ProductsCatalog, categoryFilter, search]);

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
  };

  const handleSelectClient = (client: Client) => {
    form.setValue("client.clientId", client._id, { shouldValidate: true });
    form.setValue("client.name", client.razonSocial);
    form.setValue("client.document", client.documentoId);
    setClientSearch(false);
  };

  const handleSetClient = (value: ClientType) => {
    setClientType(value);
    form.reset({
      ...form.getValues(),
      client: {
        clientId: "",
        name: "",
        document: "",
      },
    });
  };

  const handleRemoveSale = () => {
    setDiscountType("bs");
    setTab("detail-sale");
    setMetodoPago("cash");
    setClientType("quick");
    setCategoryFilter("all");
    setSearch("");
    setDiscountAmount(undefined);
    form.reset(defaultValues);
  };

  const queryClient = useQueryClient();
  const { mutate, isPending: isPendingSale } = useMutation({
    mutationFn: registerSaleAction,
    onError: (error: TypeError) => {
      toast.error(error.message);
    },
    onSuccess: (sale) => {
      queryClient.invalidateQueries({ queryKey: ["products-catalog"] });
      setSaleData(sale);
      setOpenSuccess(true);
      handleRemoveSale();
    },
  });

  const { mutate: mutatedQuotation, isPending } = useMutation({
    mutationFn: generateQuotationAction,
    onError: (error: TypeError) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Se descargó correctamente");
    },
  });

  const { mutate: mutatedPrinterTicked, isPending: isPendingPrinter } =
    useMutation({
      mutationFn: printTicketAction,
      onError: (error: TypeError) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        setOpenSuccess(false);
      },
    });

  const handleQuotation = () => {
    const data = {
      client: form.getValues("client"),
      items: form.getValues("items"),
      services: form.getValues("services"),
      globalDiscount: form.getValues("globalDiscount"),
      totalAmount: form.getValues("totalAmount"),
    };
    mutatedQuotation(data);
  };

  const onSubmit = (formData: SalesFormValues) => {
    mutate(formData);
  };

  const disabledSale =
    items.length === 0 && services.length === 0 ? true : false;

  return (
    <>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-12 gap-5"
      >
        <Tabs defaultValue="products" className="lg:col-span-8">
          <TabsList variant="line">
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
          </TabsList>

          {/* Productos */}
          <TabsContent value="products">
            {/* Select Products */}
            <Card className="flex gap-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  1. Seleccionar Productos
                </CardTitle>
              </CardHeader>

              <CardContent>
                <InputGroup className="w-full">
                  <InputGroupInput
                    placeholder="Buscar por código, nombre o marca..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <InputGroupAddon>
                    <Search className="h-4 w-4" />
                  </InputGroupAddon>

                  <InputGroupAddon align="inline-end">
                    {filteredProducts?.length ?? 0} resultados
                  </InputGroupAddon>
                </InputGroup>

                <TabsCategories
                  categoryFilter={categoryFilter}
                  handleCategoryFilter={handleCategoryFilter}
                />

                {filteredProducts?.length ? (
                  <div
                    className="
                    mt-5
                    grid
                    gap-4
                    grid-cols-[repeat(auto-fill,minmax(180px,1fr))]
                    max-h-[550px]
                    overflow-y-auto
                  "
                  >
                    {filteredProducts?.map((p) => (
                      <ProductItem
                        key={p._id}
                        product={p}
                        items={items}
                        setValue={form.setValue}
                      />
                    ))}
                  </div>
                ) : (
                  <p className=" py-10 text-sm text-center text-muted-foreground">
                    Sin productos para mostrar
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Servicios */}
          <TabsContent value="services">
            <CardServices
              setValue={form.setValue}
              services={services}
              amountServices={amountServices}
            />
          </TabsContent>
        </Tabs>

        {/* Right Panel - Summary | Client | Payment Sale */}
        <Tabs
          defaultValue={tab}
          value={tab}
          onValueChange={setTab}
          className="lg:col-span-4"
        >
          <TabsList variant={"default"} className="w-full">
            <TabsTrigger value="detail-sale">Detalle</TabsTrigger>
            <TabsTrigger disabled={disabledSale} value="client">
              Cliente
            </TabsTrigger>
            <TabsTrigger disabled={disabledSale} value="payment">
              Pago
            </TabsTrigger>
          </TabsList>

          {/* Detalle de venta */}
          <TabsContent value="detail-sale">
            <Card className="overflow-hidden">
              {/* HEADER */}
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ListCheck className="h-5 w-5 text-primary" />
                  Detalle
                </CardTitle>

                <Button
                  type="button"
                  variant="link"
                  disabled={disabledSale}
                  className="text-red-500 p-0"
                  onClick={() => handleRemoveSale()}
                >
                  <Trash className="h-4 w-4" />
                  Vaciar carrito
                </Button>
              </CardHeader>

              <Separator />

              {/* EMPTY STATE */}
              {disabledSale ? (
                <CardContent>
                  <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl py-12 px-6 bg-muted/20">
                    <ShoppingCart className="h-10 w-10 text-muted-foreground mb-4" />

                    <h3 className="font-semibold text-lg">
                      No hay items agregados
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1 max-w-[260px]">
                      Agrega productos o servicios para comenzar una nueva
                      venta.
                    </p>
                  </div>
                </CardContent>
              ) : (
                <>
                  {/* PRODUCTOS */}
                  {items.length > 0 && (
                    <>
                      <CardContent>
                        <h3 className="text-sm font-bold mb-3">
                          Productos ({items.length})
                        </h3>

                        {items.length > 0 ? (
                          <div className="divide-y divide-slate-100">
                            {items.map((item) => (
                              <ProductSaleItem
                                key={item.productId}
                                items={items}
                                item={item}
                                setValue={form.setValue}
                              />
                            ))}
                          </div>
                        ) : (
                          <ItemsEmpty>No hay productos agregados</ItemsEmpty>
                        )}
                      </CardContent>
                      <Separator />
                    </>
                  )}

                  {/* SERVICIOS */}
                  {services.length > 0 && (
                    <>
                      <CardContent>
                        <h3 className="text-sm font-bold mb-3">
                          Servicios ({services.length})
                        </h3>

                        {services.length > 0 ? (
                          <div className="divide-y divide-slate-100">
                            {services.map((service) => (
                              <ServiceItem
                                key={service.id}
                                service={service}
                                services={services}
                                setValue={form.setValue}
                              />
                            ))}
                          </div>
                        ) : (
                          <ItemsEmpty>No hay servicios agregados</ItemsEmpty>
                        )}
                      </CardContent>
                      <Separator />
                    </>
                  )}

                  {/* DESCUENTO */}
                  <CardContent>
                    <Accordion
                      type="single"
                      collapsible
                      defaultValue=""
                      className="w-full"
                    >
                      <AccordionItem value="discount" className="border-none">
                        <AccordionTrigger className="py-0 hover:no-underline">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-primary" />

                            <span className="text-sm font-medium">
                              Aplicar descuento
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex items-center gap-4 mt-5">
                            <Select
                              value={discountType}
                              onValueChange={(value: DiscountType) =>
                                setDiscountType(value)
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>

                              <SelectContent>
                                <SelectItem value="bs">Bs.</SelectItem>

                                <SelectItem value="%">%</SelectItem>
                              </SelectContent>
                            </Select>

                            <Input
                              className="flex-1"
                              type="number"
                              placeholder="0"
                              value={discountAmount ?? ""}
                              onChange={(e) =>
                                handleDiscountAmount(e.target.value)
                              }
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>

                  <Separator />

                  {/* FOOTER */}
                  <SaleSummary
                    amountProducts={amountProducts}
                    amountServices={amountServices}
                    items={items}
                    services={services}
                    globalDiscount={globalDiscount}
                    totalAmount={totalAmount}
                  >
                    <Button
                      type="button"
                      className="w-full mt-2"
                      onClick={() => setTab("client")}
                      size={"lg"}
                    >
                      Continuar
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </SaleSummary>
                </>
              )}
            </Card>
          </TabsContent>

          {/* Detalle de cliente */}
          <TabsContent value="client">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Cliente
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Tipo de Registro de cliente */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSetClient("quick")}
                    disabled={items.length === 0 && services.length === 0}
                    className={cn(
                      `
                      flex-1
                              rounded-xl border
                              p-2 flex flex-col
                              items-center justify-center
                              gap-2 transition-all duration-200
                            `,
                      clientType === "quick"
                        ? `
                                border-primary 
                                bg-primary/10
                                text-primary
                                shadow-sm
                              `
                        : `
                                hover:border-primary/40
                                hover:bg-mutated/40
                              `
                    )}
                  >
                    <UserPlus className="h-5 w-5" />
                    <span className="text-sm font-medium">Sin registro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetClient("registered")}
                    disabled={items.length === 0 && services.length === 0}
                    className={cn(
                      `
                              flex-1
                              rounded-xl border
                              p-2 flex flex-col
                              items-center justify-center
                              gap-2 transition-all duration-200
                            `,
                      clientType === "registered"
                        ? `
                                border-primary 
                                bg-primary/10
                                text-primary
                                shadow-sm
                              `
                        : `
                                hover:border-primary/40
                                hover:bg-mutated/40
                              `
                    )}
                  >
                    <UserCheck className="h-5 w-5" />
                    <span className="text-sm font-medium">Registrado</span>
                  </button>
                </div>

                {clientType === "registered" ? (
                  <div className="mt-5">
                    <Popover open={clientSearch} onOpenChange={setClientSearch}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start gap-2 text-sm font-normal h-10"
                        >
                          {client?.clientId ? (
                            <>
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate">{client.name}</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Seleccionar cliente
                              </span>
                            </>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="p-0"
                        style={{ width: "var(--radix-popover-trigger-width)" }}
                        align="start"
                      >
                        <Command>
                          <CommandInput placeholder="Nombre o NIT..." />
                          <CommandList className="max-h-48">
                            <CommandEmpty>No hay registros</CommandEmpty>
                            <CommandGroup>
                              {listClients?.clients && (
                                <>
                                  {listClients.clients.map((c) => (
                                    <CommandItem
                                      key={c._id}
                                      value={`${c.razonSocial} ${c.documentoId}`}
                                      onSelect={() => handleSelectClient(c)}
                                      className="cursor-pointer"
                                    >
                                      <div className="flex flex-col">
                                        <span className="font-medium text-sm">
                                          {c.razonSocial}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {c.tipoDocumento === "nit"
                                            ? "NIT:"
                                            : "CI:"}
                                          {c.documentoId}
                                        </span>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </>
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                ) : (
                  <div className="mt-5 space-y-5">
                    <Controller
                      control={form.control}
                      name="client.name"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>
                            Nombre / Razón Social{" "}
                          </FieldLabel>
                          <Input {...field} id={field.name} placeholder="S/N" />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="client.document"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>
                            NIT / CI (opcional)
                          </FieldLabel>
                          <Input {...field} id={field.name} placeholder="S/N" />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                )}
              </CardContent>

              <Separator />
              {/* FOOTER */}
              <SaleSummary
                amountProducts={amountProducts}
                amountServices={amountServices}
                items={items}
                services={services}
                globalDiscount={globalDiscount}
                totalAmount={totalAmount}
              >
                <div className="flex gap-2">
                  <Button
                    type="button"
                    className="flex-1"
                    disabled={isPending}
                    size={"lg"}
                    onClick={() => handleQuotation()}
                  >
                    {isPending ? (
                      <>
                        <Spinner data-icon="inline-start" />
                        Cargando...
                      </>
                    ) : (
                      <>
                        Cotizar
                        <FileDownIcon />
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    className="flex-1"
                    size={"lg"}
                    onClick={() => setTab("payment")}
                  >
                    Continuar <ArrowRight />
                  </Button>
                </div>
              </SaleSummary>
            </Card>
          </TabsContent>

          {/* Detalle de pago */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Pago
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Método de Pago</Label>

                  <div className="grid grid-cols-3 gap-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      const active = metodoPago === method.value;

                      return (
                        <button
                          key={method.value}
                          type="button"
                          onClick={() => setMetodoPago(method.value)}
                          disabled={items.length === 0 && services.length === 0}
                          className={cn(
                            `
                              rounded-xl border
                              p-2 flex flex-col
                              items-center justify-center
                              gap-2 transition-all duration-200
                            `,
                            active
                              ? `
                                border-primary 
                                bg-primary/10
                                text-primary
                                shadow-sm
                              `
                              : `
                                hover:border-primary/40
                                hover:bg-mutated/40
                              `
                          )}
                        >
                          <Icon className="h-4 w-5" />
                          <span className="text-sm font-medium">
                            {method.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {metodoPago === "mixed" && (
                  <div className="flex gap-2 justify-between">
                    <Field>
                      <FieldLabel htmlFor="cash-amount">Efectivo</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id="cash-amount"
                          type="number"
                          max={totalAmount}
                          placeholder="0"
                          value={cashAmount ?? ""}
                          onChange={(e) => handleCashChange(e.target.value)}
                        />
                        <InputGroupAddon>
                          <InputGroupText>Bs.</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="qr-amount">QR</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          type="number"
                          id="qr-amount"
                          value={qrAmount}
                          readOnly
                        />
                        <InputGroupAddon>
                          <InputGroupText>Bs.</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                  </div>
                )}

                <Controller
                  control={form.control}
                  name="notes"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Nota (Opcional)
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Observaciones..."
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
              <Separator />

              {/* FOOTER */}
              <SaleSummary
                amountProducts={amountProducts}
                amountServices={amountServices}
                items={items}
                services={services}
                globalDiscount={globalDiscount}
                totalAmount={totalAmount}
              >
                <Button
                  type="submit"
                  disabled={
                    (items.length === 0 && services.length === 0) ||
                    isPendingSale
                  }
                  className="w-full"
                  size={"lg"}
                >
                  {isPending ? (
                    <>
                      <Spinner data-icon="inline-start" />
                      Procesando venta...
                    </>
                  ) : (
                    <>
                      <ShoppingCart /> Registrar Venta
                    </>
                  )}
                </Button>
              </SaleSummary>
            </Card>
          </TabsContent>
        </Tabs>
      </form>

      <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <DialogContent className="sm:max-w-sm print:hidden">
          <DialogHeader>
            <DialogTitle>¡Venta Exitosa!</DialogTitle>
            <DialogDescription>Venta procesada exitosamente</DialogDescription>
          </DialogHeader>
          <div className="text-sm space-y-1">
            <p>
              <strong>Código:</strong> {saleData?.code}
            </p>
            <p>
              <strong>Total:</strong> Bs {saleData?.totalAmount}
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DialogClose>

            <Button
              type="button"
              disabled={isPendingPrinter}
              onClick={() => mutatedPrinterTicked(saleData!)}
            >
              {isPending ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Imprimiendo...
                </>
              ) : (
                <>
                  <Printer /> Imprimir Recibo
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
