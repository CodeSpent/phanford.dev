import VerticalNavigationLayout from "../components/VerticalNavigationLayout";
import HeroComponent from "../components/Hero";
import ResumeTimeline from "../components/ResumeTimeline";
import RecentPosts from "../components/RecentPosts";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { getTopArticles } from "../utils/fs/api";
import { Fragment } from "react";

const IndexPage = ({ recentArticles }) => (
  <VerticalNavigationLayout title="Patrick Hanford | Web, Software, Mobile, DevOps">
    <Fragment>
      <HeroComponent />

      <a className="fixed inset-x-0 bottom-0 mt-20 flex flex-col items-center justify-center p-4">
        <ChevronDownIcon
          className="mr-1 h-8 w-8 animate-bounce text-white group-hover:text-white"
          aria-hidden="true"
        />
      </a>
    </Fragment>

    <ResumeTimeline />
    <RecentPosts articles={recentArticles} />
  </VerticalNavigationLayout>
);

export async function getStaticProps() {
  const articles = getTopArticles(3);

  return {
    props: {
      recentArticles: articles,
    },
  };
}

export default IndexPage;
