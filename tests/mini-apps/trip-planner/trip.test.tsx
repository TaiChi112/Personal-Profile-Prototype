import { describe, it, expect, mock, beforeEach } from 'bun:test';
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

const mockAuth = mock();
mock.module('@/auth', () => ({
  auth: mockAuth,
}));

const mockTripRepository = {
  getTrips: mock(),
  addTrip: mock(),
  deleteTrip: mock(),
};
mock.module('@/lib/repositories/trip.repository', () => ({
  TripRepository: mockTripRepository,
}));

mock.module('next/cache', () => ({
  revalidatePath: mock(),
}));

import TripCalc from '@/app/projects/(micro-apps)/trip-planner/components/TripCalc';
import Page from '@/app/projects/(micro-apps)/trip-planner/page';

describe('Trip Planner Component and Page Suite', () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockTripRepository.getTrips.mockReset();
    mockTripRepository.addTrip.mockReset();
    mockTripRepository.deleteTrip.mockReset();
  });

  describe('TripCalc Component', () => {
    it('should render form fields and empty state when initialTrips is empty', () => {
      const { getByText, getByRole, getAllByRole } = render(
        <TripCalc initialTrips={[]} />
      );

      expect(getByText('Plan a New Trip')).toBeInTheDocument();
      expect(getByText('Destination')).toBeInTheDocument();
      expect(getByText('Start Date')).toBeInTheDocument();
      expect(getByText('End Date')).toBeInTheDocument();
      expect(getByText('Budget ($)')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Add Trip' })).toBeInTheDocument();

      expect(getByText('Your Trips')).toBeInTheDocument();
      expect(getByText('No trips planned yet.')).toBeInTheDocument();
    });

    it('should render trips list with formatted budget and dates', () => {
      const mockTrips = [
        {
          id: 't-1',
          destination: 'Tokyo, Japan',
          startDate: '2026-11-01',
          endDate: '2026-11-08',
          budget: 2500,
        },
        {
          id: 't-2',
          destination: 'Rome, Italy',
          startDate: '2027-04-10',
          endDate: '2027-04-20',
          budget: 3200.75,
        },
      ];

      const { getByText, getAllByText } = render(
        <TripCalc initialTrips={mockTrips} />
      );

      expect(getByText('Tokyo, Japan')).toBeInTheDocument();
      expect(getByText('2026-11-01 to 2026-11-08')).toBeInTheDocument();
      expect(getByText('Budget: $2500.00')).toBeInTheDocument();

      expect(getByText('Rome, Italy')).toBeInTheDocument();
      expect(getByText('2027-04-10 to 2027-04-20')).toBeInTheDocument();
      expect(getByText('Budget: $3200.75')).toBeInTheDocument();

      const deleteButtons = getAllByText('Delete');
      expect(deleteButtons).toHaveLength(2);
    });

    it('should trigger delete action when clicking Delete button', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-trip-1' } });
      mockTripRepository.deleteTrip.mockResolvedValue({ id: 't-1' });

      const mockTrips = [
        {
          id: 't-1',
          destination: 'Tokyo, Japan',
          startDate: '2026-11-01',
          endDate: '2026-11-08',
          budget: 2500,
        },
      ];

      const { getByText } = render(<TripCalc initialTrips={mockTrips} />);

      const deleteBtn = getByText('Delete');
      await act(async () => {
        fireEvent.click(deleteBtn);
      });

      expect(mockTripRepository.deleteTrip).toHaveBeenCalledWith('user-trip-1', 't-1');
    });
  });

  describe('Page Server Component', () => {
    it('should render login card when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null);

      const PageComponent = await Page();
      const { getByText, getByRole } = render(PageComponent);

      expect(getByText('Trip Planner')).toBeInTheDocument();
      expect(getByText('Please log in to use the Trip Planner.')).toBeInTheDocument();

      const backLink = getByRole('link', { name: '← Back' });
      expect(backLink).toBeInTheDocument();
      expect(backLink.getAttribute('href')).toBe('/projects');
      expect(mockTripRepository.getTrips).not.toHaveBeenCalled();
    });

    it('should fetch trips from repository and render TripCalc when authenticated', async () => {
      const dummyUserId = 'user-trip-99';
      mockAuth.mockResolvedValue({ user: { id: dummyUserId } });

      const mockTrips = [
        {
          id: 'trip-1',
          destination: 'Iceland Aurora',
          startDate: '2027-02-15',
          endDate: '2027-02-22',
          budget: 4000,
        },
      ];
      mockTripRepository.getTrips.mockResolvedValue(mockTrips);

      const PageComponent = await Page();
      const { getByText } = render(PageComponent);

      expect(mockTripRepository.getTrips).toHaveBeenCalledWith(dummyUserId);
      expect(getByText('Iceland Aurora')).toBeInTheDocument();
      expect(getByText('Budget: $4000.00')).toBeInTheDocument();
    });
  });
});
