import {
  Cog,
  Folders,
  Home,
  ListCheck,
  Package,
  Settings2,
  ShoppingCart,
  Store,
  Truck,
  UserRoundCog,
  Users,
  Wallet,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import NavSales from "./nav-sales";
import NavHome from "./nav-home";
import NavCatalog from "./nav-catalog";
import NavInventory from "./nav-inventory";
import NavOperations from "./nav-operations";
import NavConfig from "./nav-config";

export const navigation = {
  home: {
    title: "Inicio",
    url: "/home",
    icon: Home,
  },

  sales: [
    {
      title: "Nueva Venta",
      url: "/sales",
      icon: ShoppingCart,
    },
    {
      title: "Historial",
      url: "/sales/history",
      icon: ListCheck,
    },
  ],
  catalog: [
    {
      title: "Productos",
      url: "/products",
      icon: Package,
    },
    {
      title: "Categorías",
      url: "/categories",
      icon: Folders,
    },
    {
      title: "Proveedores",
      url: "/suppliers",
      icon: Truck,
    },
  ],
  inventory: [
    {
      title: "Compras",
      url: "/purchases",
      icon: Store,
    },
    {
      title: "Ajustes de Stock",
      url: "/adjustments",
      icon: Settings2,
    },
  ],
  operations: [
    {
      title: "Clientes",
      url: "/clients",
      icon: Users,
    },
    {
      title: "Caja",
      url: "/cash-register",
      icon: Wallet,
    },
  ],
  config: {
    title: "Perfil",
    url: "/config/profile",
    icon: UserRoundCog,
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <div className="flex aspect-square bg-sidebar-primary size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <img src="/logo3.png" alt="" className="rounded-" />
                  {/* <Cog className="size-4" /> */}
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium uppercase">Taller. Llanos</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavHome item={navigation.home} isCollapsed={isCollapsed} />
        <NavSales sales={navigation.sales} isCollapsed={isCollapsed} />

        <NavCatalog catalog={navigation.catalog} isCollapsed={isCollapsed} />

        <NavInventory
          inventory={navigation.inventory}
          isCollapsed={isCollapsed}
        />

        <NavOperations
          operations={navigation.operations}
          isCollapsed={isCollapsed}
        />

        <NavConfig item={navigation.config} isCollapsed={isCollapsed} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
