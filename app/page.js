// app/page.js
import HomepageApp from '@/components/HomepageApp';

export const metadata = {
  title: "LegitPoll - Social Polling Platform",
  description: "Where social media users debate through polls. Vote on yes/no questions and see how different platforms think!",
};

export default function Home() {
  return <HomepageApp />;
}