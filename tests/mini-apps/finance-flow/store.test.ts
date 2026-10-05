import { describe, it, expect, beforeEach } from "bun:test";
import { useFinanceStore } from "@/app/projects/(micro-apps)/finance-flow/store/useFinanceStore";

describe("useFinanceStore Zustand Store", () => {
  const initialDefaultTransactions = [
    { id: 1, type: "income", amount: 50000, label: "Salary" },
    { id: 2, type: "expense", amount: 15000, label: "Rent" },
    { id: 3, type: "expense", amount: 500, label: "Coffee" },
  ];

  beforeEach(() => {
    // Reset store state to initial before each test
    useFinanceStore.setState({
      transactions: [...initialDefaultTransactions],
    });
  });

  it("should have initial transactions set up properly", () => {
    const state = useFinanceStore.getState();
    expect(state.transactions).toEqual(initialDefaultTransactions);
    expect(state.transactions.length).toBe(3);
  });

  describe("addTx", () => {
    it("should prepend a new transaction with a timestamp id", () => {
      const now = 1700000000000;
      const originalDateNow = Date.now;
      Date.now = () => now;

      try {
        useFinanceStore.getState().addTx({
          type: "expense",
          amount: 120,
          label: "Books",
        });

        const state = useFinanceStore.getState();
        expect(state.transactions.length).toBe(4);
        expect(state.transactions[0]).toEqual({
          id: now,
          type: "expense",
          amount: 120,
          label: "Books",
        });
        expect(state.transactions.slice(1)).toEqual(initialDefaultTransactions);
      } finally {
        Date.now = originalDateNow;
      }
    });

    it("should support adding multiple transactions in order", () => {
      useFinanceStore.getState().addTx({
        type: "income",
        amount: 2000,
        label: "Bonus",
      });
      useFinanceStore.getState().addTx({
        type: "expense",
        amount: 45,
        label: "Lunch",
      });

      const transactions = useFinanceStore.getState().transactions;
      expect(transactions.length).toBe(5);
      expect(transactions[0].label).toBe("Lunch");
      expect(transactions[1].label).toBe("Bonus");
    });
  });

  describe("delTx", () => {
    it("should delete an existing transaction by id", () => {
      useFinanceStore.getState().delTx(2);

      const transactions = useFinanceStore.getState().transactions;
      expect(transactions.length).toBe(2);
      expect(transactions.find((t: any) => t.id === 2)).toBeUndefined();
      expect(transactions.map((t: any) => t.id)).toEqual([1, 3]);
    });

    it("should not modify transactions if the target id does not exist", () => {
      useFinanceStore.getState().delTx(9999);

      const transactions = useFinanceStore.getState().transactions;
      expect(transactions.length).toBe(3);
      expect(transactions).toEqual(initialDefaultTransactions);
    });

    it("should delete a newly added transaction", () => {
      const customId = 987654;
      const originalDateNow = Date.now;
      Date.now = () => customId;

      try {
        useFinanceStore.getState().addTx({
          type: "expense",
          amount: 80,
          label: "Snacks",
        });

        expect(useFinanceStore.getState().transactions.length).toBe(4);

        useFinanceStore.getState().delTx(customId);

        const transactions = useFinanceStore.getState().transactions;
        expect(transactions.length).toBe(3);
        expect(transactions.find((t: any) => t.id === customId)).toBeUndefined();
      } finally {
        Date.now = originalDateNow;
      }
    });

    it("should allow deleting all transactions sequentially", () => {
      useFinanceStore.getState().delTx(1);
      useFinanceStore.getState().delTx(2);
      useFinanceStore.getState().delTx(3);

      const transactions = useFinanceStore.getState().transactions;
      expect(transactions).toEqual([]);
      expect(transactions.length).toBe(0);
    });
  });
});
