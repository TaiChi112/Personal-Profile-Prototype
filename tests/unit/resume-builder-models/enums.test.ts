import { describe, it, expect } from "bun:test";
import {
  BUILDER_VIEW_VALUES,
  AI_ANALYSIS_STATE_VALUES,
  FEATURE_RESUME_STATUS_VALUES,
  PERSISTED_RESUME_STATUS_VALUES,
  DEFAULT_SKILL_CATEGORY_VALUES,
  type BuilderView,
  type AiAnalysisState,
  type FeatureResumeStatus,
  type PersistedResumeStatus,
  type DefaultSkillCategory,
  type SkillCategory,
} from "../../../lib/resume-builder-models/enums";

describe("Resume Builder Enums", () => {
  describe("BUILDER_VIEW_VALUES", () => {
    it("should contain the expected builder views in correct order", () => {
      expect(BUILDER_VIEW_VALUES).toEqual([
        "dashboard",
        "builder_manual",
        "builder_ai",
      ]);
    });

    it("should have exactly 3 view options", () => {
      expect(BUILDER_VIEW_VALUES.length).toBe(3);
    });

    it("should not contain duplicate values", () => {
      const uniqueValues = new Set(BUILDER_VIEW_VALUES);
      expect(uniqueValues.size).toBe(BUILDER_VIEW_VALUES.length);
    });

    it("should allow valid BuilderView assignments", () => {
      const validViews: BuilderView[] = [
        "dashboard",
        "builder_manual",
        "builder_ai",
      ];
      validViews.forEach((view) => {
        expect(BUILDER_VIEW_VALUES.includes(view)).toBe(true);
      });
    });

    it("should reject invalid view values", () => {
      const invalidView = "builder_unknown" as unknown as BuilderView;
      expect(BUILDER_VIEW_VALUES.includes(invalidView)).toBe(false);
    });
  });

  describe("AI_ANALYSIS_STATE_VALUES", () => {
    it("should contain the expected AI analysis states in correct order", () => {
      expect(AI_ANALYSIS_STATE_VALUES).toEqual([
        "idle",
        "analyzing",
        "done",
      ]);
    });

    it("should have exactly 3 analysis states", () => {
      expect(AI_ANALYSIS_STATE_VALUES.length).toBe(3);
    });

    it("should not contain duplicate values", () => {
      const uniqueValues = new Set(AI_ANALYSIS_STATE_VALUES);
      expect(uniqueValues.size).toBe(AI_ANALYSIS_STATE_VALUES.length);
    });

    it("should allow valid AiAnalysisState assignments", () => {
      const validStates: AiAnalysisState[] = ["idle", "analyzing", "done"];
      validStates.forEach((state) => {
        expect(AI_ANALYSIS_STATE_VALUES.includes(state)).toBe(true);
      });
    });

    it("should reject invalid analysis states", () => {
      const invalidState = "error" as unknown as AiAnalysisState;
      expect(AI_ANALYSIS_STATE_VALUES.includes(invalidState)).toBe(false);
    });
  });

  describe("FEATURE_RESUME_STATUS_VALUES", () => {
    it("should contain the expected feature resume statuses", () => {
      expect(FEATURE_RESUME_STATUS_VALUES).toEqual([
        "Draft",
        "Applied",
        "Interviewing",
      ]);
    });

    it("should have exactly 3 feature statuses", () => {
      expect(FEATURE_RESUME_STATUS_VALUES.length).toBe(3);
    });

    it("should not contain duplicate values", () => {
      const uniqueValues = new Set(FEATURE_RESUME_STATUS_VALUES);
      expect(uniqueValues.size).toBe(FEATURE_RESUME_STATUS_VALUES.length);
    });

    it("should allow valid FeatureResumeStatus assignments", () => {
      const validStatuses: FeatureResumeStatus[] = [
        "Draft",
        "Applied",
        "Interviewing",
      ];
      validStatuses.forEach((status) => {
        expect(FEATURE_RESUME_STATUS_VALUES.includes(status)).toBe(true);
      });
    });

    it("should reject non-feature resume statuses", () => {
      const invalidStatus = "Archived" as unknown as FeatureResumeStatus;
      expect(FEATURE_RESUME_STATUS_VALUES.includes(invalidStatus)).toBe(false);
    });
  });

  describe("PERSISTED_RESUME_STATUS_VALUES", () => {
    it("should contain the expected persisted resume statuses", () => {
      expect(PERSISTED_RESUME_STATUS_VALUES).toEqual([
        "Draft",
        "Published",
        "Archived",
      ]);
    });

    it("should have exactly 3 persisted statuses", () => {
      expect(PERSISTED_RESUME_STATUS_VALUES.length).toBe(3);
    });

    it("should not contain duplicate values", () => {
      const uniqueValues = new Set(PERSISTED_RESUME_STATUS_VALUES);
      expect(uniqueValues.size).toBe(PERSISTED_RESUME_STATUS_VALUES.length);
    });

    it("should allow valid PersistedResumeStatus assignments", () => {
      const validStatuses: PersistedResumeStatus[] = [
        "Draft",
        "Published",
        "Archived",
      ];
      validStatuses.forEach((status) => {
        expect(PERSISTED_RESUME_STATUS_VALUES.includes(status)).toBe(true);
      });
    });

    it("should reject invalid persisted statuses", () => {
      const invalidStatus = "Applied" as unknown as PersistedResumeStatus;
      expect(PERSISTED_RESUME_STATUS_VALUES.includes(invalidStatus)).toBe(false);
    });

    it("should share Draft status with FeatureResumeStatus but differ on other statuses", () => {
      expect(PERSISTED_RESUME_STATUS_VALUES.includes("Draft")).toBe(true);
      expect(FEATURE_RESUME_STATUS_VALUES.includes("Draft")).toBe(true);

      expect(PERSISTED_RESUME_STATUS_VALUES.includes("Published")).toBe(true);
      expect(FEATURE_RESUME_STATUS_VALUES.includes("Published" as unknown as FeatureResumeStatus)).toBe(false);

      expect(FEATURE_RESUME_STATUS_VALUES.includes("Interviewing")).toBe(true);
      expect(PERSISTED_RESUME_STATUS_VALUES.includes("Interviewing" as unknown as PersistedResumeStatus)).toBe(false);
    });
  });

  describe("DEFAULT_SKILL_CATEGORY_VALUES", () => {
    it("should contain standard default skill categories", () => {
      expect(DEFAULT_SKILL_CATEGORY_VALUES).toEqual([
        "programming",
        "frameworks",
        "tools",
        "custom",
      ]);
    });

    it("should have exactly 4 default categories", () => {
      expect(DEFAULT_SKILL_CATEGORY_VALUES.length).toBe(4);
    });

    it("should not contain duplicate values", () => {
      const uniqueValues = new Set(DEFAULT_SKILL_CATEGORY_VALUES);
      expect(uniqueValues.size).toBe(DEFAULT_SKILL_CATEGORY_VALUES.length);
    });

    it("should allow valid DefaultSkillCategory assignments", () => {
      const validCategories: DefaultSkillCategory[] = [
        "programming",
        "frameworks",
        "tools",
        "custom",
      ];
      validCategories.forEach((cat) => {
        expect(DEFAULT_SKILL_CATEGORY_VALUES.includes(cat)).toBe(true);
      });
    });

    it("should support SkillCategory including custom string extensions", () => {
      const defaultCat: SkillCategory = "programming";
      const customCat: SkillCategory = "machine_learning";
      const anotherCustomCat: SkillCategory = "cloud_devops";

      expect(typeof defaultCat).toBe("string");
      expect(typeof customCat).toBe("string");
      expect(typeof anotherCustomCat).toBe("string");

      expect(DEFAULT_SKILL_CATEGORY_VALUES.includes(defaultCat as DefaultSkillCategory)).toBe(true);
      expect(DEFAULT_SKILL_CATEGORY_VALUES.includes(customCat as DefaultSkillCategory)).toBe(false);
    });
  });
});
