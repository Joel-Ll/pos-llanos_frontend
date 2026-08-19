import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import SalesForm from "@/components/sales/SalesForm";
import { useSidebarStore } from "@/store/sidebar.store";
import { getOpenCashAction } from "@/actions/cash-register/get-open-cash.action";
import { PackageX } from "lucide-react";

export default function PosView() {
  const navigate = useNavigate();
  EmptyContent;
  const { handleItemClick } = useSidebarStore();

  // Traer caja abierta
  const { data } = useQuery({
    queryKey: ["cash-register-open"],
    queryFn: getOpenCashAction,
    retry: false,
  });

  const handleOpenCash = () => {
    handleItemClick("Caja");
    navigate("/cash-register");
  };

  return (
    <div data-aos="fade-in" data-aos-duration="300">
      {!data ? (
        <Empty className="border border-gray-400 border-dashed mt-10">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageX className="text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>{data}</EmptyTitle>
            <EmptyDescription>
              Para poder realizar ventas, es necesario tener una caja abierta.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={handleOpenCash}>Ir a cajas</Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <SalesForm cashRegOpen={data} />
        </>
      )}
    </div>
  );
}
