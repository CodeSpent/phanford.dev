import {useArticleSearchContext} from "../../constants/article-list-context/article-list-context";
import SearchControl from "../controls/search-control";

export default function ArticleSearch() {
  const {searchValue, setSearchValue} = useArticleSearchContext()

  return (
    <div>
      <SearchControl
        label="Search Articles"
        placeholder="Search"
        value={searchValue}
        onChange={(value) => {
          setSearchValue(value);
        }}
        hotkey="⌘K"
      />
    </div>
  );
}
