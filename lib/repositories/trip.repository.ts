import { prisma } from "../prisma";

export class TripRepository {
  static async getTrips(userId: string) {
    return prisma.trip.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async addTrip(userId: string, data: { destination: string; startDate: string; endDate: string; budget: number }) {
    return prisma.trip.create({
      data: {
        userId,
        destination: data.destination,
        startDate: data.startDate,
        endDate: data.endDate,
        budget: data.budget,
      },
    });
  }

  static async deleteTrip(userId: string, tripId: string) {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== userId) throw new Error("Trip not found");
    return prisma.trip.delete({
      where: { id: tripId },
    });
  }
}
