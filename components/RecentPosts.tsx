import ArticleCard from "./blog/ArticleCard";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function RecentPosts({ articles }) {
  return (
    <div className="px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
      <div className="relative mx-auto max-w-lg lg:max-w-7xl">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Recent posts
          </h2>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Nullam risus blandit ac aliquam justo ipsum. Quam mauris volutpat
            massa dictumst amet. Sapien tortor lacus arcu.
          </p>
        </div>
        <div className="grid gap-16 pt-12 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
          {articles.map((article) => (
            <ArticleCard
              slug={article.slug}
              title={article.title}
              description={article.description}
              publishedDate={article.date}
              publishedDateTime={article.datetime}
              tags={article.tags}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
