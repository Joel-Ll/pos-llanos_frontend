import { Link } from "react-router";
import { useSidebarStore } from "@/store/sidebar.store";
import type { LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./ui/sidebar";

type TNavHome = {
  title: string;
  url: string;
  icon: LucideIcon;
};

interface Props {
  item: TNavHome;
  isCollapsed: boolean;
}

export default function NavHome({ item, isCollapsed }: Props) {
  const { handleItemClick, activeItem } = useSidebarStore();
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={activeItem === item.title}
              onClick={() => handleItemClick(item.title)}
            >
              {item.url && (
                <Link to={item.url && item.url}>
                  <item.icon />
                  {!isCollapsed && <span className="">{item.title}</span>}
                </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
