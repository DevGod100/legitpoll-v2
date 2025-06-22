// app/create/page.js
import CreatePollForm from '@/components/CreatePollForm';

export const metadata = {
  title: "Create Poll - LegitPoll",
  description: "Create a new poll and see what the world thinks",
};

export default function CreatePollPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-md mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg">🗳️</span>
            </div>
            <h1 className="text-xl font-bold">Create Poll</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-md mx-auto py-6 px-4">
        <CreatePollForm />
      </main>
    </div>
  );
}