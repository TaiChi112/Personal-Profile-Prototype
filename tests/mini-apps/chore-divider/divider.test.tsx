import { describe, it, expect, beforeEach } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import Divider from "@/app/projects/(micro-apps)/chore-divider/components/Divider";
import Page from "@/app/projects/(micro-apps)/chore-divider/page";
import { useChoreStore } from "@/app/projects/(micro-apps)/chore-divider/store/useChoreStore";

describe("Divider Component & Page", () => {
  beforeEach(() => {
    useChoreStore.setState({
      people: ["Alice", "Bob", "Charlie"],
      chores: ["Take out Trash", "Wash Dishes", "Clean Bathroom"],
      assignments: [],
    });
  });

  it("should render roommates, chores, and initial empty duty message", () => {
    render(<Divider />);

    expect(screen.getByText("Roommates")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();

    expect(screen.getByText("Chores")).toBeInTheDocument();
    expect(screen.getByText("Take out Trash")).toBeInTheDocument();
    expect(screen.getByText("Wash Dishes")).toBeInTheDocument();
    expect(screen.getByText("Clean Bathroom")).toBeInTheDocument();

    expect(screen.getByText("Click assign to distribute chores")).toBeInTheDocument();
    expect(screen.getByText("Assign Duties")).toBeInTheDocument();
  });

  it("should distribute duties when Assign Duties button is clicked", () => {
    render(<Divider />);

    const assignBtn = screen.getByText("Assign Duties");
    fireEvent.click(assignBtn);

    expect(screen.queryByText("Click assign to distribute chores")).not.toBeInTheDocument();

    // Check that all 3 persons appear in the duty section
    expect(screen.getAllByText("Alice").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Bob").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Charlie").length).toBeGreaterThanOrEqual(1);
  });

  it("should render Page component with title and back link", () => {
    render(<Page />);

    expect(screen.getByText("🧹 Chore Divider")).toBeInTheDocument();
    expect(screen.getByText("← Back")).toBeInTheDocument();
  });
});
