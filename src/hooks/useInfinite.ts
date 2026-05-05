"use client";
import { IPagination } from "@/types/common";
import { UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

// --------------------|| Types Declaration ||--------------------

type WithPagination<TData, TKey extends string> = {
  pagination: IPagination;
} & {
  [K in TKey]: TData[];
};

// --------------------|| Main hook Declaration ||--------------------

export function useInfinite<TData, TKey extends string>(
  query: UseQueryResult<WithPagination<TData, TKey>, Error | AxiosError>,
  key: TKey,
  page: number
) {
  const [allData, setAllData] = useState<TData[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    const items = query.data?.[key];
    if (items) {
      setAllData((prev) => (page === 1 ? items : [...prev, ...items]));
      setHasMore(!!query?.data?.pagination?.nextPage);
    }
  }, [query.data, key]);

  return {
    ...query,
    hasMore,
    allData
  };
}
