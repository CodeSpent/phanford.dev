import { useContext, useState } from "react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Combobox } from "@headlessui/react";
import { ArticleSearchContext } from "../../constants/article-search-context/article-search-context";

type Props = {
  tags: string[];
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ArticleTagFilter({ tags }: Props) {
  const { filterValue, setFilterValue } = useContext(ArticleSearchContext);

  const [filteredTags, setFilteredTags] = useState(tags);

  return (
    <Combobox as="div" value={filterValue} onChange={setFilterValue} multiple>
      <Combobox.Label className="block text-sm font-medium text-gray-500">
        Filter by Tag
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-30 h-9 rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 capitalize text-black shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => {
            if (event.target.value.length > 0) {
              setFilteredTags(
                tags.filter((tag: string) =>
                  tag.toLowerCase().match(event.target.value.toLowerCase())
                )
              );
            } else {
              setFilteredTags(tags);
            }
          }}
          displayValue={() => {
            if (filterValue.length < 4) {
              return filterValue
                .map((tag) => tag[0].toUpperCase() + tag.slice(1, tag.length))
                .join(", ");
            } else {
              return `${filterValue.length} selected`;
            }
          }}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {tags.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base capitalize shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredTags.map((tag: string) => (
              <Combobox.Option
                key={tag}
                value={tag}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9 capitalize",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate capitalize",
                        selected && "font-semibold"
                      )}
                    >
                      {tag}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
