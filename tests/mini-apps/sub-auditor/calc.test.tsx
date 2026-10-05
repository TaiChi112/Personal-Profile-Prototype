import { describe, it, expect, beforeEach } from "bun:test";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SubCalc from "@/app/projects/(micro-apps)/sub-auditor/components/SubCalc";
import Page from "@/app/projects/(micro-apps)/sub-auditor/page";
import { useSubStore } from "@/app/projects/(micro-apps)/sub-auditor/store/useSubStore";

describe("SubCalc Component & Page", () => {
  beforeEach(() => {
    useSubStore.setState({
      subs: [
        { id: 1, name: "Netflix", price: 419, active: true },
        { id: 2, name: "Spotify", price: 139, active: true },
        { id: 3, name: "Gym", price: 1500, active: false },
      ],
    });
  });

  it("should calculate correct initial monthly and yearly burn rates", () => {
    // 419 + 139 = 558 monthly, 558 * 12 = 6,696 yearly
    render(<SubCalc />);

    expect(screen.getByText("6,696 ฿")).toBeInTheDocument();
    expect(screen.getByText("558 ฿")).toBeInTheDocument();
    expect(screen.getByText("Netflix")).toBeInTheDocument();
    expect(screen.getByText("Spotify")).toBeInTheDocument();
    expect(screen.getByText("Gym")).toBeInTheDocument();
  });

  it("should update burn rates when toggling Gym to active", () => {
    render(<SubCalc />);

    const gymRow = screen.getByText("Gym").closest("div[class*='cursor-pointer']");
    expect(gymRow).toBeDefined();

    fireEvent.click(gymRow!);

    // New active: 419 + 139 + 1500 = 2058 monthly, 2058 * 12 = 24,696 yearly
    expect(screen.getByText("24,696 ฿")).toBeInTheDocument();
    expect(screen.getByText("2,058 ฿")).toBeInTheDocument();
  });

  it("should calculate 0 burn rate when all subscriptions are inactive", () => {
    useSubStore.setState({
      subs: [
        { id: 1, name: "Netflix", price: 419, active: false },
        { id: 2, name: "Spotify", price: 139, active: false },
        { id: 3, name: "Gym", price: 1500, active: false },
      ],
    });

    render(<SubCalc />);

    const zeroTexts = screen.getAllByText("0 ฿");
    expect(zeroTexts.length).toBe(2); // One in h1 yearly, one in b monthly
  });

  it("should render Page component with back link and title", () => {
    render(<Page />);

    expect(screen.getByText("Subscription Auditor")).toBeInTheDocument();
    expect(screen.getByText("← Back")).toBeInTheDocument();
  });
});
