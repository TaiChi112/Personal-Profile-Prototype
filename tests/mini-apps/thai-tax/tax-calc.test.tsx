import { describe, it, expect, beforeEach } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import TaxCalc from "@/app/projects/(micro-apps)/thai-tax/components/TaxCalc";
import Page from "@/app/projects/(micro-apps)/thai-tax/page";
import { useTaxStore } from "@/app/projects/(micro-apps)/thai-tax/store/useTaxStore";

describe("Thai Tax Calculation & UI", () => {
  beforeEach(() => {
    useTaxStore.setState({
      salary: 50_000,
      bonus: 0,
      ssf: 0,
      insurance: 0,
    });
  });

  it("should calculate correct default tax for 50,000 monthly salary", () => {
    // Total income: 50,000 * 12 = 600,000
    // Standard deduction: min(600000 * 0.5, 100000) = 100,000
    // Personal deduction: 60,000
    // Net income: 600,000 - 100,000 - 60,000 = 440,000
    // Tax bracket: 300,000 < net <= 500,000: (440,000 - 300,000) * 0.10 + 7,500 = 14,000 + 7,500 = 21,500
    render(<TaxCalc />);

    expect(screen.getByText("600,000 ฿")).toBeInTheDocument();
    expect(screen.getByText("-100,000 ฿")).toBeInTheDocument();
    expect(screen.getByText("-60,000 ฿")).toBeInTheDocument();
    expect(screen.getByText("440,000 ฿")).toBeInTheDocument();
    expect(screen.getByText("21,500 ฿")).toBeInTheDocument();
  });

  it("should calculate 0 tax when net income is <= 150,000", () => {
    // Salary = 15,000 => total = 180,000
    // standard deduction = min(90000, 100000) = 90,000
    // personal deduction = 60,000
    // net = 180,000 - 90,000 - 60,000 = 30,000 <= 150,000 => tax = 0
    useTaxStore.setState({ salary: 15_000, bonus: 0, ssf: 0, insurance: 0 });
    render(<TaxCalc />);

    expect(screen.getByText("180,000 ฿")).toBeInTheDocument();
    expect(screen.getByText("30,000 ฿")).toBeInTheDocument();
    expect(screen.getByText("0 ฿")).toBeInTheDocument();
  });

  it("should calculate tax for 5% bracket (150,000 < net <= 300,000)", () => {
    // Total income: 360,000
    // standard: 100,000
    // personal: 60,000
    // net = 200,000
    // tax = (200,000 - 150,000) * 0.05 = 2,500
    useTaxStore.setState({ salary: 30_000, bonus: 0, ssf: 0, insurance: 0 });
    render(<TaxCalc />);

    expect(screen.getByText("200,000 ฿")).toBeInTheDocument();
    expect(screen.getByText("2,500 ฿")).toBeInTheDocument();
  });

  it("should calculate tax for 15% bracket (500,000 < net <= 750,000)", () => {
    // Want net = 600,000
    // total = 600,000 + 160,000 = 760,000 (bonus: 40,000, salary: 60,000*12=720,000)
    // tax = (600,000 - 500,000) * 0.15 + 27,500 = 15,000 + 27,500 = 42,500
    useTaxStore.setState({ salary: 60_000, bonus: 40_000, ssf: 0, insurance: 0 });
    render(<TaxCalc />);

    expect(screen.getByText("600,000 ฿")).toBeInTheDocument();
    expect(screen.getByText("42,500 ฿")).toBeInTheDocument();
  });

  it("should calculate tax for 20% bracket (750,000 < net <= 1,000,000)", () => {
    // Want net = 800,000
    // total = 800k + 160k = 960k (salary: 80k * 12 = 960k)
    // tax = (800,000 - 750,000) * 0.20 + 65,000 = 10,000 + 65,000 = 75,000
    useTaxStore.setState({ salary: 80_000, bonus: 0, ssf: 0, insurance: 0 });
    render(<TaxCalc />);

    expect(screen.getByText("800,000 ฿")).toBeInTheDocument();
    expect(screen.getByText("75,000 ฿")).toBeInTheDocument();
  });

  it("should calculate tax for 25% bracket (1,000,000 < net <= 2,000,000)", () => {
    // Want net = 1,200,000
    // total = 1.2M + 160k = 1,360,000 (salary 100,000 * 12 = 1.2M, bonus 160k)
    // tax = (1,200,000 - 1,000,000) * 0.25 + 115,000 = 50,000 + 115,000 = 165,000
    useTaxStore.setState({ salary: 100_000, bonus: 160_000, ssf: 0, insurance: 0 });
    render(<TaxCalc />);

    expect(screen.getByText("1,200,000 ฿")).toBeInTheDocument();
    expect(screen.getByText("165,000 ฿")).toBeInTheDocument();
  });

  it("should calculate tax for 30% bracket (2,000,000 < net <= 5,000,000)", () => {
    // Want net = 3,000,000
    // total = 3M + 160k = 3,160,000 (salary 250,000 * 12 = 3.0M, bonus 160k)
    // tax = (3,000,000 - 2,000,000) * 0.30 + 365,000 = 300,000 + 365,000 = 665,000
    useTaxStore.setState({ salary: 250_000, bonus: 160_000, ssf: 0, insurance: 0 });
    render(<TaxCalc />);

    expect(screen.getByText("3,000,000 ฿")).toBeInTheDocument();
    expect(screen.getByText("665,000 ฿")).toBeInTheDocument();
  });

  it("should calculate tax for 35% bracket (> 5,000,000)", () => {
    // Want net = 6,000,000
    // total = 6M + 160k = 6,160,000 (salary 500,000 * 12 = 6M, bonus 160k)
    // tax = (6,000,000 - 5,000,000) * 0.35 + 1,265,000 = 350,000 + 1,265,000 = 1,615,000
    useTaxStore.setState({ salary: 500_000, bonus: 160_000, ssf: 0, insurance: 0 });
    render(<TaxCalc />);

    expect(screen.getByText("6,000,000 ฿")).toBeInTheDocument();
    expect(screen.getByText("1,615,000 ฿")).toBeInTheDocument();
  });

  it("should correctly apply SSF and Insurance deductions", () => {
    // salary 50k => total 600,000
    // deductions: standard 100k, personal 60k, insurance 50k, ssf 40k
    // net = 600k - 100k - 60k - 50k - 40k = 350,000
    // tax: 300k < net <= 500k => (350k - 300k)*0.10 + 7,500 = 5,000 + 7,500 = 12,500
    useTaxStore.setState({ salary: 50_000, bonus: 0, ssf: 40_000, insurance: 50_000 });
    render(<TaxCalc />);

    expect(screen.getByText("350,000 ฿")).toBeInTheDocument();
    expect(screen.getByText("12,500 ฿")).toBeInTheDocument();
  });

  it("should handle inputs change events and update store", () => {
    render(<TaxCalc />);

    const inputs = screen.getAllByRole("spinbutton");
    // [salaryInput, bonusInput, insuranceInput, ssfInput]
    expect(inputs.length).toBe(4);

    fireEvent.change(inputs[0], { target: { value: "70000" } });
    expect((useTaxStore.getState() as any).salary).toBe(70_000);

    fireEvent.change(inputs[1], { target: { value: "30000" } });
    expect((useTaxStore.getState() as any).bonus).toBe(30_000);

    fireEvent.change(inputs[2], { target: { value: "20000" } });
    expect((useTaxStore.getState() as any).insurance).toBe(20_000);

    fireEvent.change(inputs[3], { target: { value: "15000" } });
    expect((useTaxStore.getState() as any).ssf).toBe(15_000);
  });

  it("should render main Page component with back link and title", () => {
    render(<Page />);
    expect(screen.getByText("ThaiTax Planner")).toBeInTheDocument();
    expect(screen.getByText("← Back")).toBeInTheDocument();
  });
});
