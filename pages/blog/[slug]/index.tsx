import Link from "next/link";
import { useMarkdownRenderer } from "../../../utils/markdown/useMarkdownRenderer";
import ArticleLayout from "../../../components/blog/ArticleLayout";
import {
  getArticlesBySlug,
  getAllArticles,
  articlesDirectory,
  Article,
} from "../../../utils/fs/api";
import markdownToHtml from "../../../utils/markdown/markdownToHtml";
import {
  CalendarIcon,
  ClockIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/solid";
import path from "path";

type Props = {
  article: Partial<Article>;
  markdownHTML: string;
  slug: string;
  articlesDirectory: string;
};

const Article = ({ article, markdownHTML, slug, articlesDirectory }: Props) => {
  const articleBody = useMarkdownRenderer({
    markdownHTML,
    serverPath: ["/articles", slug],
  });

  return (
    <ArticleLayout>
      <div className="rounded bg-gray-800 p-8">
        <div className="flex justify-between">
          <Link href="/blog" className="text-decoration-white mb-8 flex items-center gap-1">
              <ChevronDoubleLeftIcon className="h-4 w-4" />
              <p className="text-gray-400 hover:text-white">Back to articles</p>
          </Link>
          <Link href="/blog" className="text-decoration-white mb-8 flex items-center gap-1">
              <p className="text-gray-400 hover:text-white">Next Article</p>
              <ChevronDoubleRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="mb-12">
          <div className="mb-4">
            <p className="text-lg text-gray-300">{article.tags?.join(" | ")}</p>
            <h1 className="text-6xl text-white">{article.title}</h1>
          </div>
          <div className="my-4 flex gap-7">
            <span className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              <p className="text-gray-400">
                {article.minutesToRead} minute read
              </p>
            </span>

            <span className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <p className="text-gray-400">
                {new Date(article.published).toDateString()}
              </p>
            </span>
          </div>
        </div>
        <article className="article-body">{articleBody}</article>
      </div>
    </ArticleLayout>
  );
};

export async function getStaticProps({ params }: any) {
  const article = getArticlesBySlug(params.slug);

  const isStr = (val: any): val is string => typeof val === "string";
  const slug = isStr(article.slug) ? article.slug : "";

  const { html: markdownHTML, headingsWithId } = await markdownToHtml(
    article.content,
    path.resolve(articlesDirectory, slug)
  );

  return {
    props: {
      article: {
        ...article,
        content: "",
        headingsWithId,
        markdownHTML,
      },
      markdownHTML,
      slug: slug,
      articlesDirectory,
    } as Props,
  };
}

export async function getStaticPaths() {
  const articles = getAllArticles();

  const paths = articles.map((article) => {
    return {
      params: {
        slug: article.slug,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export default Article;
