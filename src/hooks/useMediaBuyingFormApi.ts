
import { useBrandsApi } from "./api/useBrandsApi";
import { useEmployeesApi } from "./api/useEmployeesApi";
import { useMediaBuyingSubmitApi } from "./api/useMediaBuyingSubmitApi";
import { MediaBuying } from "@/types";

export const useMediaBuyingApi = () => {
  const { brands } = useBrandsApi();
  const { employees } = useEmployeesApi("media_buying");
  const { loading, saveMediaBuying } = useMediaBuyingSubmitApi();

  return {
    brands,
    employees,
    loading,
    saveMediaBuying,
  };
};
