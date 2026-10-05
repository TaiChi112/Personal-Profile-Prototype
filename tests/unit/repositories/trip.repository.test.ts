import { describe, it, expect, mock, beforeEach } from "bun:test";

const mockTrip = {
  findMany: mock(),
  findUnique: mock(),
  create: mock(),
  delete: mock(),
};

const mockPrisma = {
  trip: mockTrip,
};

mock.module('@/lib/prisma', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

mock.module('../../../lib/prisma', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

import { TripRepository } from "@/lib/repositories/trip.repository";

describe("TripRepository", () => {
  beforeEach(() => {
    mockTrip.findMany.mockReset();
    mockTrip.findUnique.mockReset();
    mockTrip.create.mockReset();
    mockTrip.delete.mockReset();
  });

  it("should instantiate class correctly", () => {
    const repo = new TripRepository();
    expect(repo).toBeInstanceOf(TripRepository);
  });

  describe("getTrips", () => {
    it("should fetch trips for user ordered by createdAt desc", async () => {
      const mockTrips = [
        { id: "trip-1", userId: "user-1", destination: "Tokyo", startDate: "2026-04-01", endDate: "2026-04-10", budget: 3000 },
        { id: "trip-2", userId: "user-1", destination: "Paris", startDate: "2026-05-01", endDate: "2026-05-10", budget: 4000 },
      ];
      mockTrip.findMany.mockResolvedValueOnce(mockTrips);

      const result = await TripRepository.getTrips("user-1");

      expect(mockTrip.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockTrips);
    });
  });

  describe("addTrip", () => {
    it("should create a trip with user data", async () => {
      const input = {
        destination: "Kyoto",
        startDate: "2026-06-01",
        endDate: "2026-06-07",
        budget: 2500,
      };
      const createdTrip = { id: "trip-3", userId: "user-1", ...input };
      mockTrip.create.mockResolvedValueOnce(createdTrip);

      const result = await TripRepository.addTrip("user-1", input);

      expect(mockTrip.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          destination: input.destination,
          startDate: input.startDate,
          endDate: input.endDate,
          budget: input.budget,
        },
      });
      expect(result).toEqual(createdTrip);
    });
  });

  describe("deleteTrip", () => {
    it("should throw error if trip does not exist", async () => {
      mockTrip.findUnique.mockResolvedValueOnce(null);

      await expect(TripRepository.deleteTrip("user-1", "non-existent")).rejects.toThrow(
        "Trip not found"
      );
      expect(mockTrip.delete).not.toHaveBeenCalled();
    });

    it("should throw error if trip belongs to another user", async () => {
      mockTrip.findUnique.mockResolvedValueOnce({
        id: "trip-1",
        userId: "other-user",
      });

      await expect(TripRepository.deleteTrip("user-1", "trip-1")).rejects.toThrow(
        "Trip not found"
      );
      expect(mockTrip.delete).not.toHaveBeenCalled();
    });

    it("should delete trip when authorized", async () => {
      mockTrip.findUnique.mockResolvedValueOnce({
        id: "trip-1",
        userId: "user-1",
      });
      const deletedTrip = { id: "trip-1", userId: "user-1", destination: "Tokyo" };
      mockTrip.delete.mockResolvedValueOnce(deletedTrip);

      const result = await TripRepository.deleteTrip("user-1", "trip-1");

      expect(mockTrip.findUnique).toHaveBeenCalledWith({
        where: { id: "trip-1" },
      });
      expect(mockTrip.delete).toHaveBeenCalledWith({
        where: { id: "trip-1" },
      });
      expect(result).toEqual(deletedTrip);
    });
  });
});
