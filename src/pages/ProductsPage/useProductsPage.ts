import { useCallback, useMemo } from "react";
import { getProducts, getProductsAmount } from "../../api/products";
import { useAppParams } from "../../enhancers/hooks/appParams";
import { useRequest } from "../../enhancers/hooks/request";
import { useProductsSort } from "../../enhancers/hooks/sort";
import { PerPageOption, usePagination } from "../../enhancers/hooks/pagination";
import { DropdownOption } from "../../components/UI/Dropdown/Dropdown";
import { capitalize } from "../../utils/stringHelper";

export function useProductsPage() {
  const { category } = useAppParams();

  const getAmount = () => getProductsAmount(category);
  const [productsAmount, amountLoading, amountError] = useRequest(getAmount, [category]);
  const amountHandled = amountLoading ? 0 : (productsAmount ?? 0);

  const [sortBy, sortByOptions, setSortBy, sortQuery] = useProductsSort();
  const changeSortBy = useCallback((option: DropdownOption) => setSortBy(`${option}`), []);

  const perPageOptions: PerPageOption[] = useMemo(() => [4, 8, 16, 'All'], []);
  const params = { perPageOptions, itemsAmount: amountHandled, defaultIndex: 2 };
  const [page, setPage, perPage, setPerPage] = usePagination(params);
    const changePerPage = useCallback((option: DropdownOption) => (
      option === 'All' ? setPerPage('All') : setPerPage(+option)
    ), []);

  const loadProducts = () => getProducts(category, { page, perPage, sortQuery });
  const [products, loading, error] = useRequest(
    loadProducts, [category, page, perPage, sortQuery]
  );

  return {
    amountLoading,
    someProducts: amountHandled > 0,
    amount: amountHandled,
    category: capitalize(category),
    someError: error || amountError,
    products,
    productsLoading: loading,
    perPageIsAll: perPage === 'All',
    sortBy,
    sortByOptions,
    changeSortBy,
    perPageOptions,
    perPage,
    changePerPage,
    page,
    setPage,
  };
}