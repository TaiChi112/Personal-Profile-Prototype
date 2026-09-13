'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { TripRepository } from '@/lib/repositories/trip.repository';

export async function addTripAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const destination = formData.get('destination') as string;
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;
  const budget = parseFloat(formData.get('budget') as string) || 0;

  await TripRepository.addTrip(session.user.id, { destination, startDate, endDate, budget });
  revalidatePath('/projects/trip-planner');
}

export async function deleteTripAction(tripId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await TripRepository.deleteTrip(session.user.id, tripId);
  revalidatePath('/projects/trip-planner');
}
