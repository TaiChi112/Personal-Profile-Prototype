"use client";
import React, { useTransition } from 'react';
import { addTripAction, deleteTripAction } from '../actions';

type Trip = {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
};

export default function TripCalc({ initialTrips }: { initialTrips: Trip[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-6">Plan a New Trip</h3>
        <form action={addTripAction} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-500">Destination</label>
            <input name="destination" type="text" required className="w-full p-3 border rounded-lg mt-1 dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-500">Start Date</label>
              <input name="startDate" type="date" required className="w-full p-3 border rounded-lg mt-1 dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-500">End Date</label>
              <input name="endDate" type="date" required className="w-full p-3 border rounded-lg mt-1 dark:bg-gray-700 dark:border-gray-600" />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-gray-500">Budget ($)</label>
            <input name="budget" type="number" required min="0" step="0.01" className="w-full p-3 border rounded-lg mt-1 dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <button type="submit" disabled={isPending} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50">
            Add Trip
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-6">Your Trips</h3>
        {initialTrips.length === 0 ? (
          <p className="text-gray-500">No trips planned yet.</p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {initialTrips.map(trip => (
              <div key={trip.id} className="p-4 border rounded-xl flex justify-between items-center dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div>
                  <h4 className="font-bold text-lg">{trip.destination}</h4>
                  <p className="text-sm text-gray-500">{trip.startDate} to {trip.endDate}</p>
                  <p className="text-sm font-semibold mt-1">Budget: ${trip.budget.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => startTransition(() => deleteTripAction(trip.id))}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-semibold text-sm disabled:opacity-50"
                  disabled={isPending}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
