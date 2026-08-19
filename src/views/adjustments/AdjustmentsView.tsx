import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdjustmentsAction } from "@/actions/adjustments/get-adjustments.action";
import { AdjustmentsForm } from "@/components/adjustments/AdjustmentsForm";
import { AdjustmentsHistory } from "@/components/adjustments/AdjustmentsHistory";

export const AdjustmentsView = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["adjustments", page],
    queryFn: () => getAdjustmentsAction(page, limit),
    retry: false,
  });

  return (
    <div data-aos="fade-in" data-aos-duration="300">
      <div className="space-y-8">
        <AdjustmentsForm />

        <AdjustmentsHistory
          isLoading={isLoading}
          data={data?.data ?? []}
          page={page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};
