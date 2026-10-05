import { describe, it, expect, beforeEach } from "bun:test";
import { useTaxStore } from "@/app/projects/(micro-apps)/thai-tax/store/useTaxStore";

describe("useTaxStore Zustand Store", () => {
  beforeEach(() => {
    useTaxStore.setState({
      salary: 50000,
      bonus: 0,
      ssf: 0,
      insurance: 0,
    });
  });

  it("should have correct initial values", () => {
    const state = useTaxStore.getState() as any;
    expect(state.salary).toBe(50000);
    expect(state.bonus).toBe(0);
    expect(state.ssf).toBe(0);
    expect(state.insurance).toBe(0);
  });

  it("should update salary correctly", () => {
    const store = useTaxStore.getState() as any;
    store.update("salary", 80000);
    expect((useTaxStore.getState() as any).salary).toBe(80000);
  });

  it("should update bonus correctly", () => {
    const store = useTaxStore.getState() as any;
    store.update("bonus", 150000);
    expect((useTaxStore.getState() as any).bonus).toBe(150000);
  });

  it("should update ssf correctly", () => {
    const store = useTaxStore.getState() as any;
    store.update("ssf", 50000);
    expect((useTaxStore.getState() as any).ssf).toBe(50000);
  });

  it("should update insurance correctly", () => {
    const store = useTaxStore.getState() as any;
    store.update("insurance", 100000);
    expect((useTaxStore.getState() as any).insurance).toBe(100000);
  });
});
