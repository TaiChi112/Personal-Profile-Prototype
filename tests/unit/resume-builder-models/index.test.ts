import { describe, it, expect } from "bun:test";
import * as IndexExports from "../../../lib/resume-builder-models/index";
import * as EnumsExports from "../../../lib/resume-builder-models/enums";
import * as ModelsExports from "../../../lib/resume-builder-models/models";

describe("Resume Builder Models Barrel Index", () => {
  it("should re-export all constants from enums.ts", () => {
    expect(IndexExports.BUILDER_VIEW_VALUES).toBe(
      EnumsExports.BUILDER_VIEW_VALUES,
    );
    expect(IndexExports.AI_ANALYSIS_STATE_VALUES).toBe(
      EnumsExports.AI_ANALYSIS_STATE_VALUES,
    );
    expect(IndexExports.FEATURE_RESUME_STATUS_VALUES).toBe(
      EnumsExports.FEATURE_RESUME_STATUS_VALUES,
    );
    expect(IndexExports.PERSISTED_RESUME_STATUS_VALUES).toBe(
      EnumsExports.PERSISTED_RESUME_STATUS_VALUES,
    );
    expect(IndexExports.DEFAULT_SKILL_CATEGORY_VALUES).toBe(
      EnumsExports.DEFAULT_SKILL_CATEGORY_VALUES,
    );
  });

  it("should re-export all factory functions from models.ts", () => {
    expect(IndexExports.asSkillId).toBe(ModelsExports.asSkillId);
    expect(IndexExports.asProjectId).toBe(ModelsExports.asProjectId);
    expect(IndexExports.asExperienceId).toBe(ModelsExports.asExperienceId);
    expect(IndexExports.asCertificateId).toBe(ModelsExports.asCertificateId);
    expect(IndexExports.asAwardId).toBe(ModelsExports.asAwardId);
    expect(IndexExports.asResumeId).toBe(ModelsExports.asResumeId);
  });

  it("should successfully execute functions re-exported from index", () => {
    expect(IndexExports.asSkillId("skill-from-index")).toBe("skill-from-index");
    expect(IndexExports.asProjectId("proj-from-index")).toBe("proj-from-index");
    expect(IndexExports.asExperienceId("exp-from-index")).toBe("exp-from-index");
    expect(IndexExports.asCertificateId("cert-from-index")).toBe(
      "cert-from-index",
    );
    expect(IndexExports.asAwardId("award-from-index")).toBe("award-from-index");
    expect(IndexExports.asResumeId("resume-from-index")).toBe(
      "resume-from-index",
    );
  });
});
