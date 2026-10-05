import { describe, it, expect, mock, beforeEach } from "bun:test";

const mockAuth = mock();
const mockRevalidatePath = mock();
const mockNoteRepo = {
  addNote: mock(),
  updateNote: mock(),
  deleteNote: mock(),
  getNotes: mock(),
};

mock.module("@/auth", () => ({
  auth: mockAuth,
}));

mock.module("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}));

mock.module("@/lib/repositories/noteflow.repository", () => ({
  NoteFlowRepository: mockNoteRepo,
}));

import { addNoteAction, updateNoteAction, deleteNoteAction } from "../../../app/projects/(micro-apps)/noteflow/actions";

describe("NoteFlow Server Actions", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockRevalidatePath.mockReset();
    mockNoteRepo.addNote.mockReset();
    mockNoteRepo.updateNote.mockReset();
    mockNoteRepo.deleteNote.mockReset();
  });

  describe("addNoteAction", () => {
    it("should throw error if session is not authenticated", async () => {
      mockAuth.mockResolvedValueOnce(null);
      expect(addNoteAction()).rejects.toThrow("Unauthorized");
    });

    it("should throw error if user id is missing in session", async () => {
      mockAuth.mockResolvedValueOnce({ user: {} });
      expect(addNoteAction()).rejects.toThrow("Unauthorized");
    });

    it("should create note and revalidate path on successful authentication", async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: "user-123" } });
      mockNoteRepo.addNote.mockResolvedValueOnce({ id: "n1", title: "New Note", content: "Body" });

      await addNoteAction("New Note", "Body");

      expect(mockNoteRepo.addNote).toHaveBeenCalledWith("user-123", "New Note", "Body");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/noteflow");
    });
  });

  describe("updateNoteAction", () => {
    it("should throw error if session is not authenticated", async () => {
      mockAuth.mockResolvedValueOnce(null);
      expect(updateNoteAction("n1", "content", "title")).rejects.toThrow("Unauthorized");
    });

    it("should update note content/title and revalidate path", async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: "user-123" } });
      mockNoteRepo.updateNote.mockResolvedValueOnce({ id: "n1", title: "New Title", content: "New Content" });

      await updateNoteAction("n1", "New Content", "New Title");

      expect(mockNoteRepo.updateNote).toHaveBeenCalledWith("user-123", "n1", "New Content", "New Title");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/noteflow");
    });
  });

  describe("deleteNoteAction", () => {
    it("should throw error if session is not authenticated", async () => {
      mockAuth.mockResolvedValueOnce(null);
      expect(deleteNoteAction("n1")).rejects.toThrow("Unauthorized");
    });

    it("should delete note and revalidate path", async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: "user-123" } });
      mockNoteRepo.deleteNote.mockResolvedValueOnce({ id: "n1" });

      await deleteNoteAction("n1");

      expect(mockNoteRepo.deleteNote).toHaveBeenCalledWith("user-123", "n1");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/noteflow");
    });
  });
});
