import { describe, it, expect, mock, beforeEach } from "bun:test";
import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";

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

// Mock LedgerRepository
const mockLedgerRepository = {
  getRecords: mock(),
  addRecord: mock(),
  toggleReturn: mock(),
  deleteRecord: mock(),
};

mock.module("@/lib/repositories/ledger.repository", () => ({
  LedgerRepository: mockLedgerRepository,
}));
mock.module("../../../lib/repositories/ledger.repository", () => ({
  LedgerRepository: mockLedgerRepository,
}));

import Page from "@/app/projects/(micro-apps)/lend-ledger/page";
import Ledger from "@/app/projects/(micro-apps)/lend-ledger/components/Ledger";

describe("Lend Ledger Page and Component", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockRevalidatePath.mockReset();
    mockLedgerRepository.getRecords.mockReset();
    mockLedgerRepository.addRecord.mockReset();
    mockLedgerRepository.toggleReturn.mockReset();
    mockLedgerRepository.deleteRecord.mockReset();
  });

  describe("Page Component", () => {
    it("should render login screen if user is not authenticated", async () => {
      mockAuth.mockResolvedValueOnce(null);

      const pageComponent = await Page();
      render(pageComponent);

      expect(screen.getByText("Please login to manage your lendings.")).toBeInTheDocument();
      expect(screen.getByText("Login with Google")).toBeInTheDocument();
    });

    it("should render Ledger with records when authenticated", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user-1" } });
      const records = [
        { id: "r1", name: "Bob", item: "Laptop", date: "2026-10-01", returned: false },
      ];
      mockLedgerRepository.getRecords.mockResolvedValueOnce(records);

      const pageComponent = await Page();
      render(pageComponent);

      expect(screen.getByText("LendLedger 🤝")).toBeInTheDocument();
      expect(screen.getByText("Bob borrowed Laptop")).toBeInTheDocument();
      expect(screen.getByText("Since 2026-10-01")).toBeInTheDocument();
    });
  });

  describe("Ledger Component", () => {
    it("should render records properly (returned vs active)", () => {
      const records = [
        { id: "r1", name: "Alice", item: "Book", date: "2026-09-01", returned: false },
        { id: "r2", name: "Charlie", item: "Camera", date: "2026-09-05", returned: true },
      ];

      render(<Ledger records={records} />);

      expect(screen.getByText("Alice borrowed Book")).toBeInTheDocument();
      expect(screen.getByText("Charlie borrowed Camera")).toBeInTheDocument();
      expect(screen.getByText("✓")).toBeInTheDocument();
    });

    it("should trigger addRecord when Who and What are entered and + is clicked", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user-1" } });
      mockLedgerRepository.addRecord.mockResolvedValueOnce({ id: "r-new" });

      render(<Ledger records={[]} />);

      const whoInput = screen.getByPlaceholderText("Who?");
      const whatInput = screen.getByPlaceholderText("What (Money/Item)?");
      const addBtn = screen.getByText("+");

      fireEvent.change(whoInput, { target: { value: "Dave" } });
      fireEvent.change(whatInput, { target: { value: "1000 Baht" } });

      await act(async () => {
        fireEvent.click(addBtn);
      });

      expect(mockLedgerRepository.addRecord).toHaveBeenCalled();
    });

    it("should not trigger addRecord if Who or What is missing", async () => {
      render(<Ledger records={[]} />);

      const whoInput = screen.getByPlaceholderText("Who?");
      const addBtn = screen.getByText("+");

      fireEvent.change(whoInput, { target: { value: "Dave" } });
      await act(async () => {
        fireEvent.click(addBtn);
      });

      expect(mockLedgerRepository.addRecord).not.toHaveBeenCalled();
    });

    it("should trigger toggleReturn when check button is clicked", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user-1" } });
      mockLedgerRepository.toggleReturn.mockResolvedValueOnce({ id: "r1", returned: true });

      const records = [
        { id: "r1", name: "Alice", item: "Book", date: "2026-09-01", returned: false },
      ];
      render(<Ledger records={records} />);

      const toggleBtn = screen.getByRole("button", { name: "" }); // empty check button
      await act(async () => {
        fireEvent.click(toggleBtn);
      });

      expect(mockLedgerRepository.toggleReturn).toHaveBeenCalledWith("user-1", "r1");
    });

    it("should trigger deleteRecord when delete button is clicked", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user-1" } });
      mockLedgerRepository.deleteRecord.mockResolvedValueOnce({ id: "r1" });

      const records = [
        { id: "r1", name: "Alice", item: "Book", date: "2026-09-01", returned: false },
      ];
      render(<Ledger records={records} />);

      const deleteBtn = screen.getByText("✕");
      await act(async () => {
        fireEvent.click(deleteBtn);
      });

      expect(mockLedgerRepository.deleteRecord).toHaveBeenCalledWith("user-1", "r1");
    });
  });
});
