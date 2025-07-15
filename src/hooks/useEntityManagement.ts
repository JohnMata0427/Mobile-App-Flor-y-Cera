import { useCallback, useEffect, useMemo, useState } from 'react';

export type Filter<T> = {
  key: keyof T;
  value: string;
};

interface UseEntityManagementProps<T> {
  fetchEntities: (page: number, limit: number) => Promise<{ data: T[]; totalPages: number }>;
  filterFunction: (entities: T[], filter: Filter<T>) => T[];
  searchFunction: (entities: T[], searchTerm: string) => T[];
  initialFilter: Filter<T>;
}

export const useEntityManagement = <T extends { _id: string }>({
  fetchEntities,
  filterFunction,
  searchFunction,
  initialFilter,
}: UseEntityManagementProps<T>) => {
  const [entities, setEntities] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [limit, setLimit] = useState<number>(50);
  const [filter, setFilter] = useState<Filter<T>>(initialFilter);
  const [search, setSearch] = useState<string>('');

  const getEntities = async () => {
    try {
      setLoading(true);
      if (page === 1) setEntities([]);

      const { data, totalPages: newTotalPages } = await fetchEntities(page, limit);
      setTotalPages(newTotalPages);

      if (page === 1) {
        setEntities(data);
      } else {
        setEntities(prev => [...prev, ...data]);
      }
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    getEntities();
  }, []);

  const searchedEntities = useMemo(() => {
    const filtered = filterFunction(entities, filter);
    return searchFunction(filtered, search);
  }, [entities, filter, search, filterFunction, searchFunction]);

  return {
    entities,
    setEntities,
    loading,
    refreshing,
    page,
    totalPages,
    filter,
    searchedEntities,
    setRefreshing,
    setPage,
    setLimit,
    setFilter,
    setSearch,
    getEntities,
  };
};
