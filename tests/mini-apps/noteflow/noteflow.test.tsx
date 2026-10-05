import { describe, it, expect, mock, beforeEach } from "bun:test";
import React from "react";

const mockAuth = mock();
const mockNoteRepo = {
  getNotes: mock(),
  addNote: mock(),
  updateNote: mock(),
  deleteNote: mock(),
};

const mockAddNoteAction = mock();
const mockUpdateNoteAction = mock();
const mockDeleteNoteAction = mock();

mock.module("@/auth", () => ({
  auth: mockAuth,
}));

mock.module("@/lib/repositories/noteflow.repository", () => ({
  NoteFlowRepository: mockNoteRepo,
}));

mock.module("../../../app/projects/(micro-apps)/noteflow/actions", () => ({
  addNoteAction: mockAddNoteAction,
  updateNoteAction: mockUpdateNoteAction,
  deleteNoteAction: mockDeleteNoteAction,
}));

import { render, fireEvent, act } from "@testing-library/react";
import MarkdownEditor from "../../../app/projects/(micro-apps)/noteflow/components/MarkdownEditor";
import NoteFlowPage from "../../../app/projects/(micro-apps)/noteflow/page";

const dummyNotes = [
  { id: "note-1", title: "First Note", content: "# First Heading\nFirst line body", updatedAt: new Date("2026-10-01") },
  { id: "note-2", title: "Second Note", content: "Second body text", updatedAt: new Date("2026-10-02") },
];

describe("NoteFlow Micro-App Components & Page", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockNoteRepo.getNotes.mockReset();
    mockAddNoteAction.mockReset();
    mockUpdateNoteAction.mockReset();
    mockDeleteNoteAction.mockReset();
  });

  describe("MarkdownEditor Component", () => {
    it("should render initial notes list and select first note by default", () => {
      const { getByText, getByDisplayValue, container } = render(<MarkdownEditor initialNotes={dummyNotes} />);
      expect(getByText("First Note")).toBeInTheDocument();
      expect(getByText("Second Note")).toBeInTheDocument();

      // First note should be active
      expect(getByDisplayValue("First Note")).toBeInTheDocument();
      const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
      expect(textarea.value).toBe("# First Heading\nFirst line body");
    });

    it("should switch active note when clicked in the sidebar", () => {
      const { getByText, getByDisplayValue, container } = render(<MarkdownEditor initialNotes={dummyNotes} />);
      const secondNoteTab = getByText("Second Note");

      act(() => {
        fireEvent.click(secondNoteTab);
      });

      expect(getByDisplayValue("Second Note")).toBeInTheDocument();
      const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
      expect(textarea.value).toBe("Second body text");
    });

    it("should render markdown preview with header and breaks", () => {
      const { container } = render(<MarkdownEditor initialNotes={dummyNotes} />);
      const preview = container.querySelector(".prose") as HTMLElement;
      expect(preview.innerHTML).toContain("<h1>First Heading");
      expect(preview.innerHTML).toContain("<br>");
    });

    it("should render empty state placeholder when no notes are provided", () => {
      const { getByText } = render(<MarkdownEditor initialNotes={[]} />);
      expect(getByText("Select or create a note")).toBeInTheDocument();
    });

    it("should trigger addNoteAction when clicking + New Note", () => {
      const { getByText } = render(<MarkdownEditor initialNotes={dummyNotes} />);
      const newBtn = getByText("+ New Note");

      act(() => {
        fireEvent.click(newBtn);
      });

      expect(mockAddNoteAction).toHaveBeenCalled();
    });

    it("should trigger updateNoteAction when clicking Save", () => {
      const { getByText, container } = render(<MarkdownEditor initialNotes={dummyNotes} />);
      const titleInput = container.querySelector("input[type='text']") as HTMLInputElement;
      const contentInput = container.querySelector("textarea") as HTMLTextAreaElement;
      const saveBtn = getByText("Save");

      act(() => {
        fireEvent.change(titleInput, { target: { value: "Updated Title" } });
        fireEvent.change(contentInput, { target: { value: "Updated Content" } });
        fireEvent.click(saveBtn);
      });

      expect(mockUpdateNoteAction).toHaveBeenCalledWith("note-1", "Updated Content", "Updated Title");
    });

    it("should trigger deleteNoteAction when clicking Delete and deselect note", () => {
      const { getByText } = render(<MarkdownEditor initialNotes={dummyNotes} />);
      const deleteBtn = getByText("Delete");

      act(() => {
        fireEvent.click(deleteBtn);
      });

      expect(mockDeleteNoteAction).toHaveBeenCalledWith("note-1");
      expect(getByText("Select or create a note")).toBeInTheDocument();
    });
  });

  describe("Page Component", () => {
    it("should render login screen if user is unauthenticated", async () => {
      mockAuth.mockResolvedValueOnce(null);
      const pageJsx = await NoteFlowPage();
      const { getByText } = render(pageJsx);

      expect(getByText(/NoteFlow/i)).toBeInTheDocument();
      expect(getByText("Please login to save your notes.")).toBeInTheDocument();
      expect(getByText("Login with Google")).toBeInTheDocument();
    });

    it("should fetch notes and render NoteFlow Editor when authenticated", async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: "user-456" } });
      mockNoteRepo.getNotes.mockResolvedValueOnce(dummyNotes);

      const pageJsx = await NoteFlowPage();
      const { getByText } = render(pageJsx);

      expect(mockNoteRepo.getNotes).toHaveBeenCalledWith("user-456");
      expect(getByText("NoteFlow Editor")).toBeInTheDocument();
      const backLink = getByText("← Back");
      expect(backLink.getAttribute("href")).toBe("/projects");
      expect(getByText("First Note")).toBeInTheDocument();
    });
  });
});
