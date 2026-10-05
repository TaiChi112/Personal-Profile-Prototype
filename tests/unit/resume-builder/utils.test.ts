import { describe, expect, it } from "bun:test";
import {
  formatDuration,
  formatResumeDate,
  sanitizeIds,
  toFeatureResumeStatus,
  toPersistedResumeStatus,
  emptyVaultCollections,
  createEmptyResumeConfig,
  toBasicInfo,
} from "../../../lib/resume-builder/utils";

describe("Resume Builder Utils", () => {
  describe("formatResumeDate", () => {
    it("formats Date object correctly", () => {
      const date = new Date("2023-01-15T00:00:00Z");
      expect(formatResumeDate(date)).toBe("15 Jan 2023");
    });

    it("formats ISO string correctly", () => {
      expect(formatResumeDate("2023-12-01T00:00:00Z")).toBe("01 Dec 2023");
    });
  });

  describe("formatDuration", () => {
    it("returns empty string if both dates are missing", () => {
      expect(formatDuration(null, undefined)).toBe("");
    });

    it("returns only end date (Present) if start date is missing", () => {
      expect(formatDuration(null, "2024-01-01T00:00:00Z")).toBe("Jan 2024");
    });

    it("formats start and end dates correctly", () => {
      const start = "2020-01-01T00:00:00Z";
      const end = "2023-05-01T00:00:00Z";
      expect(formatDuration(start, end)).toBe("Jan 2020 - May 2023");
    });

    it("uses 'Present' when end date is missing but start date exists", () => {
      const start = "2020-01-01T00:00:00Z";
      expect(formatDuration(start, null)).toBe("Jan 2020 - Present");
    });
  });

  describe("Status Converters", () => {
    it("toFeatureResumeStatus converts correctly", () => {
      expect(toFeatureResumeStatus("Published")).toBe("Applied");
      expect(toFeatureResumeStatus("Archived")).toBe("Interviewing");
      expect(toFeatureResumeStatus("Draft")).toBe("Draft");
      expect(toFeatureResumeStatus("Unknown")).toBe("Draft");
    });

    it("toPersistedResumeStatus converts correctly", () => {
      expect(toPersistedResumeStatus("Applied")).toBe("Published");
      expect(toPersistedResumeStatus("Interviewing")).toBe("Archived");
      expect(toPersistedResumeStatus("Draft")).toBe("Draft");
      // @ts-ignore - testing invalid input fallback
      expect(toPersistedResumeStatus("Unknown")).toBe("Draft");
    });
  });

  describe("sanitizeIds", () => {
    it("removes duplicate and empty ids", () => {
      const input = ["id1", "id2", "id1", "  ", "", "id3"];
      expect(sanitizeIds(input)).toEqual(["id1", "id2", "id3"]);
    });
    
    it("handles empty arrays", () => {
      expect(sanitizeIds([])).toEqual([]);
    });
  });

  describe("emptyVaultCollections", () => {
    it("returns an object with empty awards and certificates arrays", () => {
      const result = emptyVaultCollections();
      expect(result).toEqual({ awards: [], certificates: [] });
    });
  });

  describe("createEmptyResumeConfig", () => {
    it("creates a default empty configuration", () => {
      const config = createEmptyResumeConfig();
      expect(config.targetRole).toBe("");
      expect(config.selectedSkills).toEqual([]);
      expect(config.sectionOrder).toContain("skills");
      expect(config.sectionOrder).toContain("projects");
    });
  });

  describe("toBasicInfo", () => {
    it("converts null or undefined values to empty strings", () => {
      const result = toBasicInfo({
        name: null,
        email: undefined,
        phone: null,
        linkedin: undefined,
      });
      expect(result).toEqual({
        name: "",
        email: "",
        phone: "",
        linkedin: "",
      });
    });

    it("preserves valid string values", () => {
      const result = toBasicInfo({
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        linkedin: "johndoe",
      });
      expect(result).toEqual({
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        linkedin: "johndoe",
      });
    });
  });
});
