import { useCallback } from "react";
import { SearchParam } from "../../definitions/enums/Router";
import { SearchParamsWithRouter, useSearchParams } from "./searchParams";

export type PerPageOption = number | 'All';

type Options = {
  perPageOptions: PerPageOption[],
  itemsAmount: number,
  defaultIndex?: number,
}

type ReturnType = [
  number,
  (newPage: number) => void,
  PerPageOption,
  (newPerPage: PerPageOption) => void,
];

function getPage(searchParams: SearchParamsWithRouter) {
  const page = +(searchParams.get(SearchParam.Page) || 1);

  return Number.isNaN(page) ? 1 : page;
}

function getPerPage(searchParams: SearchParamsWithRouter, options: Options) {
  const { perPageOptions, defaultIndex = 0 } = options;
  const defaultOption = perPageOptions[defaultIndex];
  const perPageRaw = searchParams.get(SearchParam.PerPage) || defaultOption;

  if (perPageRaw !== 'All' && Number.isNaN(+perPageRaw)) {
    return defaultOption;
  }

  const perPage = perPageRaw === 'All' ? 'All' : +perPageRaw;

  if (!perPageOptions.includes(perPage)) {
    return defaultOption;
  }

  return perPage;
}

export function usePagination(options: Options): ReturnType {
  const { itemsAmount } = options;
  const searchParams = useSearchParams();

  const page = getPage(searchParams);
  const setPage = useCallback((newPage: number) => {
    searchParams.set(SearchParam.Page, newPage)
  }, [searchParams]);

  const perPage = getPerPage(searchParams, options);
  const setPerPage = useCallback((newPerPage: PerPageOption) => {
    if (newPerPage !== 'All' && newPerPage * (page - 1) > itemsAmount) {
      const lastPage = Math.ceil(itemsAmount / newPerPage);
      searchParams.set(SearchParam.Page, lastPage);
    }

    searchParams.set(SearchParam.PerPage, newPerPage)
  }, [searchParams, itemsAmount]);

  return [page, setPage, perPage, setPerPage];
};