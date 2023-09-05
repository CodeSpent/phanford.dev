import {ArticleSearchContext, useSearchValue} from "../../constants/article-search-context/article-search-context";
import React, { useCallback, useContext, useMemo, useState } from "react";
import {useArticleSearchContext} from "../../constants/article-list-context/article-list-context";
import Input from "../common/Input";

export default function ArticleSearch() {
const {searchValue, setSearchValue} = useArticleSearchContext()

  return (
    <div>
      <div className="relative mt-1 flex h-9 items-center">
        <Input label="Search Articles" type="text" placeholder="Search" value={searchValue}
               onChange={(event) => {
          const value = (event.target as HTMLInputElement).value;
          setSearchValue(value);
        }}>


        </Input>

        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          <kbd className="inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm
          font-medium text-gray-400">
            ⌘K
          </kbd>
        </div>
      </div>
    </div>
  );
}
