import { ArticleSearchContext } from "../constants/article-search-context/article-search-context";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { ArticleListContext } from "../constants/article-list-context/article-list-context";

export default function ArticleSearch() {
  const { setSearchValue } = useContext(ArticleSearchContext);
  const { setSortValue } = useContext(ArticleListContext);

  return (
    <div>
      <label
        htmlFor="search"
        className="block text-sm font-medium text-gray-500"
      >
        Search Articles
      </label>
      <div className="relative mt-1 flex h-9 items-center">
        <input
          type="text"
          name="search"
          id="search"
          className="block w-full rounded-md border-gray-300 pr-12 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => {
            const value = (event.target as HTMLInputElement).value;
            setSearchValue(value);
          }}
        />
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          <kbd className="inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm font-medium text-gray-400">
            ⌘K
          </kbd>
        </div>
      </div>
    </div>
  );
}
