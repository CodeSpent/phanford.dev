import { useContext, useState } from "react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Combobox } from "@headlessui/react";
import { useFilterValue} from "../../constants/article-search-context/article-search-context";
import {ComboBoxInput} from "../common/Input";
import {classNames} from "../../utils/common";
import {useArticleSearchContext} from "../../constants/article-list-context/article-list-context";

type Props = {
  tags: string[];
};

export default function ArticleTagFilter({ tags }: Props) {
  const { filterValue, setFilterValue } = useArticleSearchContext()
  const [filteredTags, setFilteredTags] = useState(tags);

  return (
   <>
    <ComboBoxInput label="Filter by Tag"
                   placeholder="Select Tags"
                   value={filterValue}
                   onChange={(e) => setFilterValue(e)}
                   options={filteredTags.map((tag) => {
                     return {
                       label: tag,
                       value: tag
                     }
                   })}
    />
   </>
  );
}
