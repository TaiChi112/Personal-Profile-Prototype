import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockAuth = mock();
const mockRevalidatePath = mock();
const mockTripRepository = {
  getTrips: mock(),
  addTrip: mock(),
  deleteTrip: mock(),
};

mock.module('@/auth', () => ({
  auth: mockAuth,
}));

mock.module('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}));

mock.module('@/lib/repositories/trip.repository', () => ({
  TripRepository: mockTripRepository,
}));

import {
  addTripAction,
  deleteTripAction,
} from '@/app/projects/(micro-apps)/trip-planner/actions';

describe('Trip Planner Server Actions', () => {
  const dummyUserId = 'user-trip-123';
  const dummySession = {
    user: { id: dummyUserId, email: 'trip@example.com' },
  };

  beforeEach(() => {
    mockAuth.mockReset();
    mockRevalidatePath.mockReset();
    mockTripRepository.getTrips.mockReset();
    mockTripRepository.addTrip.mockReset();
    mockTripRepository.deleteTrip.mockReset();
  });

  describe('addTripAction', () => {
    it('should throw Unauthorized if session is null', async () => {
      mockAuth.mockResolvedValueOnce(null);

      const formData = new FormData();
      formData.set('destination', 'Tokyo');
      formData.set('startDate', '2026-11-01');
      formData.set('endDate', '2026-11-10');
      formData.set('budget', '3000');

      await expect(addTripAction(formData)).rejects.toThrow('Unauthorized');
      expect(mockTripRepository.addTrip).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it('should throw Unauthorized if session user has no id', async () => {
      mockAuth.mockResolvedValueOnce({ user: { email: 'noid@example.com' } });

      const formData = new FormData();
      formData.set('destination', 'Paris');
      formData.set('startDate', '2026-12-01');
      formData.set('endDate', '2026-12-07');
      formData.set('budget', '2500');

      await expect(addTripAction(formData)).rejects.toThrow('Unauthorized');
      expect(mockTripRepository.addTrip).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it('should add trip and revalidate path for authenticated user', async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      mockTripRepository.addTrip.mockResolvedValueOnce({
        id: 'trip-1',
        destination: 'Kyoto',
        startDate: '2026-11-01',
        endDate: '2026-11-08',
        budget: 1800,
        userId: dummyUserId,
      });

      const formData = new FormData();
      formData.set('destination', 'Kyoto');
      formData.set('startDate', '2026-11-01');
      formData.set('endDate', '2026-11-08');
      formData.set('budget', '1800.50');

      await addTripAction(formData);

      expect(mockAuth).toHaveBeenCalledTimes(1);
      expect(mockTripRepository.addTrip).toHaveBeenCalledWith(dummyUserId, {
        destination: 'Kyoto',
        startDate: '2026-11-01',
        endDate: '2026-11-08',
        budget: 1800.5,
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith('/projects/trip-planner');
    });

    it('should fallback to 0 if budget is not provided or NaN', async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      mockTripRepository.addTrip.mockResolvedValueOnce({ id: 'trip-2' });

      const formData = new FormData();
      formData.set('destination', 'London');
      formData.set('startDate', '2027-01-01');
      formData.set('endDate', '2027-01-05');
      formData.set('budget', 'invalid-budget');

      await addTripAction(formData);

      expect(mockTripRepository.addTrip).toHaveBeenCalledWith(dummyUserId, {
        destination: 'London',
        startDate: '2027-01-01',
        endDate: '2027-01-05',
        budget: 0,
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith('/projects/trip-planner');
    });

    it('should propagate repository error and avoid revalidating path', async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      mockTripRepository.addTrip.mockRejectedValueOnce(new Error('DB failure'));

      const formData = new FormData();
      formData.set('destination', 'Seoul');
      formData.set('startDate', '2027-02-01');
      formData.set('endDate', '2027-02-05');
      formData.set('budget', '1000');

      await expect(addTripAction(formData)).rejects.toThrow('DB failure');
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });
  });

  describe('deleteTripAction', () => {
    it('should throw Unauthorized if session is null', async () => {
      mockAuth.mockResolvedValueOnce(null);

      await expect(deleteTripAction('trip-1')).rejects.toThrow('Unauthorized');
      expect(mockTripRepository.deleteTrip).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it('should throw Unauthorized if session user id is missing', async () => {
      mockAuth.mockResolvedValueOnce({ user: {} });

      await expect(deleteTripAction('trip-1')).rejects.toThrow('Unauthorized');
      expect(mockTripRepository.deleteTrip).not.toHaveBeenCalled();
    });

    it('should delete trip and revalidate path for authenticated user', async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      mockTripRepository.deleteTrip.mockResolvedValueOnce({ id: 'trip-1' });

      await deleteTripAction('trip-1');

      expect(mockAuth).toHaveBeenCalledTimes(1);
      expect(mockTripRepository.deleteTrip).toHaveBeenCalledWith(dummyUserId, 'trip-1');
      expect(mockRevalidatePath).toHaveBeenCalledWith('/projects/trip-planner');
    });

    it('should propagate repository error and avoid revalidating path on delete failure', async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      mockTripRepository.deleteTrip.mockRejectedValueOnce(new Error('Trip not found'));

      await expect(deleteTripAction('trip-99')).rejects.toThrow('Trip not found');
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });
  });
});
