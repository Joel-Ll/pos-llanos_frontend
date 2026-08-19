import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { FullScreenLoader } from "@/components/ui/loader-full-screen";
import { getStastDashboardAction } from "@/actions/dashboard/get-stats-dashboard.action";

export default function DashboardView() {
  const { data: userData } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getStastDashboardAction,
    retry: false,
  });

  if (isLoading) return <FullScreenLoader text="Cargando..." />;

  return (
    <div
      data-aos="fade-in"
      data-aos-duration="300"
      className="min-h-full flex justify-center pt-5 lg:pt-20"
    >
      <div className="w-full max-w-7xl space-y-4">
        {data ? (
          <>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight">
                Hola, {userData?.username} 👋
              </h1>

              <p className="mt-2 text-muted-foreground text-lg">
                Este es el resumen de hoy de la actividad de tu negocio.
              </p>
            </div>

            <StatsCard stats={data.stats} />
          </>
        ) : (
          <div>No hay datos disponibles</div>
        )}
      </div>
    </div>
  );
}
