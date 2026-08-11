import { Building2, Users, UserCheck, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ClientsStats } from "@/types/clients/clients.type";

interface Props {
  stats: ClientsStats;
}

export const StatsCard = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      <Card className="py-0">
        <CardContent className="flex items-center gap-3 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10">
            <Users className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.totalClients}
            </p>

            <p className="font-semibold">Total Clientes</p>

            <p className="text-sm text-muted-foreground">
              todos los clientes registrados
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-lime-500/10">
            <UserCheck className="h-10 w-10 text-lime-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.activeClients}
            </p>

            <p className="font-semibold">Activos</p>

            <p className="text-sm text-muted-foreground">
              clientes habilitados para ventas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Empresas */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-amber-500/10">
            <Building2 className="h-10 w-10 text-amber-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.clientCompanies}
            </p>

            <p className="font-semibold">Empresas</p>

            <p className="text-sm text-muted-foreground">
              clientes registrados como empresa
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Persons */}
      <Card className="py-0">
        <CardContent className="flex items-center gap-5 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-violet-500/10">
            <UserRound className="h-10 w-10 text-violet-500" />
          </div>

          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none">
              {stats.clientPersons}
            </p>

            <p className="font-semibold">Personas</p>

            <p className="text-sm text-muted-foreground">
              clientes registrados como persona
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
