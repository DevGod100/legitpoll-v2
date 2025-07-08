// app/poll/[id]/page.js
import PollDisplay from '@/components/polls/PollDisplay';

export default function PollPage({ params }) {
  return <PollDisplay pollId={params.id} />;
}