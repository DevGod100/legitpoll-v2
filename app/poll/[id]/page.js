// app/poll/[id]/page.js
import PollDisplay from '@/components/polls/PollDisplay';

export default async function PollPage({ params }) {
  const { id } = await params;
  return <PollDisplay pollId={id} />;
}