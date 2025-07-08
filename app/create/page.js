// app/create/page.js
import PollCreator from '@/components/polls/PollCreator';

export const metadata = {
  title: "Create Poll - LegitPoll",
  description: "Create a new poll to start a debate between Twitter and Reddit users",
};

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple header for create page */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container max-w-md mx-auto flex h-14 items-center justify-center px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg">🗳️</span>
            </div>
            <h1 className="text-xl font-bold">Create Poll</h1>
          </div>
        </div>
      </header>
      
      <main>
        <PollCreator />
      </main>
    </div>
  );
}