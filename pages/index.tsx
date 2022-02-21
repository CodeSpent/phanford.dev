import Layout from "../components/Layout";
import HeroComponent from "../components/Hero";
import ResumeTimeline from "../components/ResumeTimeline";
import RecentPosts from "../components/RecentPosts";

const IndexPage = () => (
  <Layout title="Patrick Hanford | Web, Software, Mobile, DevOps">
    <HeroComponent />
    <div className="my-4">
      <ResumeTimeline />
      <RecentPosts />
    </div>
  </Layout>
);

export default IndexPage;
