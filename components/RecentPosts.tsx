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
        <div className=" grid gap-16 pt-12 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
          {articles.map((article) => (
            <div key={article.title} className="rounded bg-white p-4">
              <div>
                <a href={article.href} className="inline-block">
                  <span
                    className={
                      "inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium"
                    }
                  >
                    {article.tags}
                  </span>
                </a>
              </div>
              <a href={article.href} className="mt-4 block">
                <p className="text-xl font-semibold text-gray-900">
                  {article.title}
                </p>
                <p className="mt-3 text-base text-gray-500">
                  {article.description}
                </p>
              </a>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <a href={article.title}>
                    <span className="sr-only">{article.title}</span>
                  </a>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    <a href={article.href}>{article.title}</a>
                  </p>
                  <div className="flex space-x-1 text-sm text-gray-500">
                    <time dateTime={article.published}>
                      {article.published}
                    </time>
                    <span aria-hidden="true">&middot;</span>
                    <span>{article.readingTime} read</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
