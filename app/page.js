import Login from '../components/Login';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">LegitPoll</h1>
        <p className="text-gray-600 mb-8">Where social media users debate through polls</p>
        <Login />
      </div>
    </div>
  );
}