import Layout from "../components/Layout";
import HeroComponent from "../components/Hero";
import ResumeTimeline from "../components/ResumeTimeline";
import RecentPosts from "../components/RecentPosts";
import { getTopArticles } from "../utils/fs/api";

const IndexPage = ({ recentArticles }) => (
  <Layout title="Patrick Hanford | Web, Software, Mobile, DevOps">
    <HeroComponent />
    <div className="my-4">
      <ResumeTimeline />
      <RecentPosts articles={recentArticles} />
    </div>
  </Layout>
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
