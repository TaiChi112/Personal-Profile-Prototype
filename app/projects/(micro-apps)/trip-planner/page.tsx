import Link from 'next/link';
import TripCalc from './components/TripCalc';
import { auth } from '@/auth';
import { TripRepository } from '@/lib/repositories/trip.repository';

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Trip Planner</h1>
        <p className="text-gray-500 mb-4">Please log in to use the Trip Planner.</p>
        <Link href="/projects" className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm">← Back</Link>
      </div>
    );
  }

  const trips = await TripRepository.getTrips(session.user.id);

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link href="/projects" className="inline-block mb-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm">← Back</Link>
        <h1 className="text-3xl font-black mb-8">Trip Planner</h1>
        <TripCalc initialTrips={trips} />
      </div>
    </div>
  );
}
