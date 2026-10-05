import { describe, it, expect, mock, beforeEach } from "bun:test";

// Mock next/cache
const mockRevalidatePath = mock();
mock.module("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}));

// Mock auth
const mockAuth = mock();
mock.module("@/auth", () => ({
  auth: mockAuth,
}));
mock.module("../../../auth", () => ({
  auth: mockAuth,
}));

// Mock prisma
const mockTimeBlockPrisma = {
  findMany: mock(),
  create: mock(),
  delete: mock(),
};

const mockPrisma = {
  timeBlock: mockTimeBlockPrisma,
};

mock.module("@/lib/prisma", () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));
mock.module("../../../lib/prisma", () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

import {
  addTimeBlockAction,
  deleteTimeBlockAction,
} from "@/app/projects/(micro-apps)/time-block/actions";

describe("Time Block Server Actions", () => {
  const dummyUserId = "user-timeblock-456";
  const dummySession = {
    user: {
      id: dummyUserId,
      email: "planner@test.com",
      name: "Time Planner",
    },
  };

  beforeEach(() => {
    mockRevalidatePath.mockReset();
    mockAuth.mockReset();
    mockTimeBlockPrisma.findMany.mockReset();
    mockTimeBlockPrisma.create.mockReset();
    mockTimeBlockPrisma.delete.mockReset();
  });

  describe("addTimeBlockAction", () => {
    it("should throw 'Unauthorized' if session is null", async () => {
      mockAuth.mockResolvedValueOnce(null);
      const formData = new FormData();
      formData.set("title", "Deep Work");
      formData.set("start", "09:00");
      formData.set("end", "11:00");

      await expect(addTimeBlockAction(formData)).rejects.toThrow("Unauthorized");
      expect(mockTimeBlockPrisma.create).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should throw 'Unauthorized' if session has no user", async () => {
      mockAuth.mockResolvedValueOnce({ user: null });
      const formData = new FormData();
      formData.set("title", "Deep Work");
      formData.set("start", "09:00");
      formData.set("end", "11:00");

      await expect(addTimeBlockAction(formData)).rejects.toThrow("Unauthorized");
      expect(mockTimeBlockPrisma.create).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should throw 'Unauthorized' if user has no id", async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: "" } });
      const formData = new FormData();
      formData.set("title", "Deep Work");
      formData.set("start", "09:00");
      formData.set("end", "11:00");

      await expect(addTimeBlockAction(formData)).rejects.toThrow("Unauthorized");
      expect(mockTimeBlockPrisma.create).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should return early without adding if title is missing", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      const formData = new FormData();
      formData.set("title", "");
      formData.set("start", "09:00");
      formData.set("end", "11:00");

      await addTimeBlockAction(formData);
      expect(mockTimeBlockPrisma.create).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should return early without adding if start is missing", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      const formData = new FormData();
      formData.set("title", "Deep Work");
      formData.set("end", "11:00");

      await addTimeBlockAction(formData);
      expect(mockTimeBlockPrisma.create).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should return early without adding if end is missing", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      const formData = new FormData();
      formData.set("title", "Deep Work");
      formData.set("start", "09:00");

      await addTimeBlockAction(formData);
      expect(mockTimeBlockPrisma.create).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should create timeblock with default color #6366F1 when color is not provided", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      mockTimeBlockPrisma.create.mockResolvedValueOnce({ id: "tb-1" });

      const formData = new FormData();
      formData.set("title", "Morning Exercise");
      formData.set("start", "06:30");
      formData.set("end", "07:30");

      await addTimeBlockAction(formData);

      expect(mockTimeBlockPrisma.create).toHaveBeenCalledWith({
        data: {
          userId: dummyUserId,
          title: "Morning Exercise",
          start: "06:30",
          end: "07:30",
          color: "#6366F1",
        },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/time-block");
    });

    it("should create timeblock with specified custom color", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      mockTimeBlockPrisma.create.mockResolvedValueOnce({ id: "tb-2" });

      const formData = new FormData();
      formData.set("title", "Client Meeting");
      formData.set("start", "14:00");
      formData.set("end", "15:30");
      formData.set("color", "#EF4444");

      await addTimeBlockAction(formData);

      expect(mockTimeBlockPrisma.create).toHaveBeenCalledWith({
        data: {
          userId: dummyUserId,
          title: "Client Meeting",
          start: "14:00",
          end: "15:30",
          color: "#EF4444",
        },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/time-block");
    });
  });

  describe("deleteTimeBlockAction", () => {
    it("should throw 'Unauthorized' if session is null", async () => {
      mockAuth.mockResolvedValueOnce(null);

      await expect(deleteTimeBlockAction("tb-1")).rejects.toThrow("Unauthorized");
      expect(mockTimeBlockPrisma.delete).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should throw 'Unauthorized' if user has no id", async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: "" } });

      await expect(deleteTimeBlockAction("tb-1")).rejects.toThrow("Unauthorized");
      expect(mockTimeBlockPrisma.delete).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should delete timeblock scoped to user id and revalidate path", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      mockTimeBlockPrisma.delete.mockResolvedValueOnce({ id: "tb-1" });

      await deleteTimeBlockAction("tb-1");

      expect(mockTimeBlockPrisma.delete).toHaveBeenCalledWith({
        where: { id: "tb-1", userId: dummyUserId },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/time-block");
    });
  });
});
