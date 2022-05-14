import { createContext, useEffect, useMemo, useState } from "react";
import { useLunr } from "../../utils/useLunr";
import { ArticleInfo } from "../../types/ArticleInfo";

const articleSearchContext = {
  searchValue: "",
  setSearchValue: (value: string) => {},
  filterValue: [] as any[],
  setFilterValue: (value: any[]) => {},
};

export const ArticleSearchContext = createContext(articleSearchContext);

export const useSearchFilterValue = () => {
  const [filterValue, setFilterValue] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  const { searchUsingLunr: filterUsingLunr, results: lunrFilterIds } =
    useLunr();
  const { searchUsingLunr, results: lunrSearchIds } = useLunr();

  useEffect(() => {
    if (!filterValue || !filterValue.length) {
      filterUsingLunr("");
    } else {
      filterUsingLunr(`tags: ${filterValue.map((value) => value).join(" ")}`);
    }
  }, [filterValue]);

  useEffect(() => {
    searchUsingLunr(searchValue);
  }, [searchValue]);

  const lunrResultSlugs = useMemo(() => {
    if (lunrFilterIds && lunrSearchIds) {
      const lunrFilterSlugs = lunrFilterIds.map(
        (articleRef) => articleRef.slug
      );
      const lunrSearchSlugs = lunrSearchIds.map(
        (articleRef) => articleRef.slug
      );

      return lunrFilterSlugs.filter((filterSlug) =>
        lunrSearchSlugs.includes(filterSlug)
      );
    }

    if (lunrFilterIds)
      return lunrFilterIds.map((articleRef) => articleRef.slug);

    if (lunrSearchIds)
      return lunrSearchIds.map((articleRef) => articleRef.slug);

    return [];
  }, [lunrFilterIds, lunrSearchIds]);

  return useMemo(
    () => ({
      searchValue,
      setSearchValue,
      filterValue,
      setFilterValue,
      lunrResultSlugs,
    }),
    [searchValue, setSearchValue, filterValue, setFilterValue, lunrResultSlugs]
  );
};
