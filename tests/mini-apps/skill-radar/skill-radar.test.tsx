import { describe, it, expect, beforeEach } from "bun:test";
import { render, fireEvent, act } from "@testing-library/react";
import { useRadarStore } from "../../../app/projects/(micro-apps)/skill-radar/store/useRadarStore";
import Radar from "../../../app/projects/(micro-apps)/skill-radar/components/Radar";
import SkillRadarPage from "../../../app/projects/(micro-apps)/skill-radar/page";

const initialSkills = [
  { id: 1, name: 'React', val: 8 },
  { id: 2, name: 'UI/UX', val: 5 },
  { id: 3, name: 'Backend', val: 6 },
  { id: 4, name: 'DevOps', val: 3 },
  { id: 5, name: 'Soft Skills', val: 9 }
];

describe("Skill Radar Micro-App", () => {
  beforeEach(() => {
    (useRadarStore as any).setState({
      skills: JSON.parse(JSON.stringify(initialSkills)),
    });
  });

  describe("useRadarStore", () => {
    it("should initialize with default skills and values", () => {
      const state = (useRadarStore as any).getState();
      expect(state.skills).toHaveLength(5);
      expect(state.skills).toEqual(initialSkills);
    });

    it("should update a skill value by id", () => {
      const { updateSkill } = (useRadarStore as any).getState();
      updateSkill(1, 10);

      const state = (useRadarStore as any).getState();
      const reactSkill = state.skills.find((s: any) => s.id === 1);
      expect(reactSkill.val).toBe(10);
    });

    it("should not affect other skills when one skill is updated", () => {
      const { updateSkill } = (useRadarStore as any).getState();
      updateSkill(2, 9);

      const state = (useRadarStore as any).getState();
      expect(state.skills.find((s: any) => s.id === 1).val).toBe(8);
      expect(state.skills.find((s: any) => s.id === 2).val).toBe(9);
      expect(state.skills.find((s: any) => s.id === 3).val).toBe(6);
    });

    it("should ignore update for non-existent skill id", () => {
      const { updateSkill } = (useRadarStore as any).getState();
      updateSkill(999, 10);

      const state = (useRadarStore as any).getState();
      expect(state.skills).toEqual(initialSkills);
    });

    it("should handle min and max boundary values", () => {
      const { updateSkill } = (useRadarStore as any).getState();
      updateSkill(3, 1);
      expect((useRadarStore as any).getState().skills.find((s: any) => s.id === 3).val).toBe(1);

      updateSkill(3, 10);
      expect((useRadarStore as any).getState().skills.find((s: any) => s.id === 3).val).toBe(10);
    });
  });

  describe("Radar Component", () => {
    it("should render SVG radar elements and skill labels", () => {
      const { container, getAllByText, getByText } = render(<Radar />);
      
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg?.getAttribute("width")).toBe("300");

      // Verify skill labels in SVG
      initialSkills.forEach(skill => {
        expect(getAllByText(skill.name).length).toBeGreaterThan(0);
      });

      // Verify Attribute Points panel
      expect(getByText("Attribute Points (1-10)")).toBeInTheDocument();
    });

    it("should render 5 range inputs with initial skill values", () => {
      const { container, getByText } = render(<Radar />);
      const inputs = container.querySelectorAll("input[type='range']");
      expect(inputs.length).toBe(5);

      expect(getByText("8/10")).toBeInTheDocument();
      expect(getByText("5/10")).toBeInTheDocument();
      expect(getByText("6/10")).toBeInTheDocument();
      expect(getByText("3/10")).toBeInTheDocument();
      expect(getByText("9/10")).toBeInTheDocument();
    });

    it("should update skill value when range input changes", () => {
      const { container, getByText, queryByText } = render(<Radar />);
      const inputs = container.querySelectorAll("input[type='range']");
      const reactInput = inputs[0] as HTMLInputElement;

      act(() => {
        fireEvent.change(reactInput, { target: { value: "4" } });
      });

      expect((useRadarStore as any).getState().skills.find((s: any) => s.id === 1).val).toBe(4);
      expect(getByText("4/10")).toBeInTheDocument();
      expect(queryByText("8/10")).toBeNull();
    });
  });

  describe("Page Component", () => {
    it("should render page with back link and radar component", () => {
      const { getByText } = render(<SkillRadarPage />);
      const backLink = getByText("← Back");
      expect(backLink).toBeInTheDocument();
      expect(backLink.getAttribute("href")).toBe("/projects");
      expect(getByText("Attribute Points (1-10)")).toBeInTheDocument();
    });
  });
});
