import { describe, it, expect, mock, beforeEach } from "bun:test";

const mockNote = {
  findMany: mock(),
  create: mock(),
  update: mock(),
  delete: mock(),
};

const mockPrisma = {
  note: mockNote,
};

mock.module("@/lib/prisma", () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

mock.module("../../../lib/prisma", () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

import { NoteFlowRepository } from "@/lib/repositories/noteflow.repository";

describe("NoteFlowRepository", () => {
  beforeEach(() => {
    mockNote.findMany.mockReset();
    mockNote.create.mockReset();
    mockNote.update.mockReset();
    mockNote.delete.mockReset();
  });

  it("should instantiate class correctly", () => {
    const repo = new NoteFlowRepository();
    expect(repo).toBeInstanceOf(NoteFlowRepository);
  });

  describe("getNotes", () => {
    it("should fetch notes for user ordered by updatedAt desc", async () => {
      const mockNotes = [
        { id: "note-1", userId: "user-1", title: "Note 1", content: "Body 1" },
        { id: "note-2", userId: "user-1", title: "Note 2", content: "Body 2" },
      ];
      mockNote.findMany.mockResolvedValueOnce(mockNotes);

      const result = await NoteFlowRepository.getNotes("user-1");

      expect(mockNote.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { updatedAt: "desc" },
      });
      expect(result).toEqual(mockNotes);
    });
  });

  describe("addNote", () => {
    it("should create a new note", async () => {
      const createdNote = { id: "note-3", userId: "user-1", title: "New Note", content: "Content" };
      mockNote.create.mockResolvedValueOnce(createdNote);

      const result = await NoteFlowRepository.addNote("user-1", "New Note", "Content");

      expect(mockNote.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          title: "New Note",
          content: "Content",
        },
      });
      expect(result).toEqual(createdNote);
    });
  });

  describe("updateNote", () => {
    it("should update a note title and content by noteId and userId", async () => {
      const updatedNote = { id: "note-1", userId: "user-1", title: "Updated Title", content: "Updated Content" };
      mockNote.update.mockResolvedValueOnce(updatedNote);

      const result = await NoteFlowRepository.updateNote("user-1", "note-1", "Updated Content", "Updated Title");

      expect(mockNote.update).toHaveBeenCalledWith({
        where: { id: "note-1", userId: "user-1" },
        data: { content: "Updated Content", title: "Updated Title" },
      });
      expect(result).toEqual(updatedNote);
    });
  });

  describe("deleteNote", () => {
    it("should delete note by noteId and userId", async () => {
      const deletedNote = { id: "note-1", userId: "user-1" };
      mockNote.delete.mockResolvedValueOnce(deletedNote);

      const result = await NoteFlowRepository.deleteNote("user-1", "note-1");

      expect(mockNote.delete).toHaveBeenCalledWith({
        where: { id: "note-1", userId: "user-1" },
      });
      expect(result).toEqual(deletedNote);
    });
  });
});
