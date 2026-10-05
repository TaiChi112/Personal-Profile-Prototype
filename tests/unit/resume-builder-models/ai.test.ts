import { describe, it, expect } from "bun:test";
import {
  asCertificateId,
  asExperienceId,
  asProjectId,
  asSkillId,
  type BasicInfo,
  type ResumeConfig,
  type VaultData,
} from "../../../lib/resume-builder-models/models";
import type {
  AnalyzeJobDescriptionRequest,
  AnalyzeJobDescriptionResult,
  ResumeAnalysisService,
} from "../../../lib/resume-builder-models/ai";

describe("Resume Analysis Service Interface & Models", () => {
  const sampleBasicInfo: BasicInfo = {
    name: "Somchai Developer",
    email: "somchai@example.com",
    phone: "0812345678",
    linkedin: "https://linkedin.com/in/somchai",
  };

  const sampleVault: VaultData = {
    basicInfo: sampleBasicInfo,
    skills: [
      { id: asSkillId("s-react"), name: "React", category: "frameworks" },
      { id: asSkillId("s-ts"), name: "TypeScript", category: "programming" },
      { id: asSkillId("s-node"), name: "Node.js", category: "tools" },
    ],
    projects: [
      {
        id: asProjectId("p-ecommerce"),
        title: "E-Commerce Web",
        duration: "2024",
        description: "Built scalable storefront",
      },
    ],
    experience: [
      {
        id: asExperienceId("e-lead"),
        company: "Tech Co",
        role: "Frontend Engineer",
        duration: "2023 - 2025",
        responsibilities: "Developed Next.js features",
      },
    ],
    certificates: [
      {
        id: asCertificateId("c-aws"),
        name: "AWS Certified Developer",
        year: "2024",
      },
    ],
    awards: [],
  };

  const sampleConfig: ResumeConfig = {
    targetRole: "Frontend Engineer",
    targetCompany: "Awesome Startups",
    summary: "Frontend engineer skilled in React.",
    selectedSkills: [asSkillId("s-react")],
    selectedProjects: [],
    selectedExperience: [],
    selectedCerts: [],
    selectedAwards: [],
    sectionOrder: ["skills", "experience", "projects"],
  };

  class MockResumeAnalysisService implements ResumeAnalysisService {
    public shouldFail = false;
    public failureMessage = "Analysis service error";
    public lastRequest?: AnalyzeJobDescriptionRequest;

    async analyzeJobDescription(
      request: AnalyzeJobDescriptionRequest,
    ): Promise<AnalyzeJobDescriptionResult> {
      this.lastRequest = request;

      if (this.shouldFail) {
        throw new Error(this.failureMessage);
      }

      // Check for keywords in job description
      const jd = request.jobDescription.toLowerCase();
      const missing: string[] = [];

      if (!request.vault.skills.some((s) => s.name.toLowerCase() === "docker") && jd.includes("docker")) {
          missing.push("Docker");
        }

      if (!request.vault.skills.some((s) => s.name.toLowerCase() === "graphql") && jd.includes("graphql")) {
          missing.push("GraphQL");
        }

      const matchScore = missing.length > 0 ? 75 : 95;

      return {
        suggestedConfig: {
          ...request.currentConfig,
          summary: `Tailored summary for: ${request.jobDescription.slice(0, 30)}...`,
          selectedSkills: request.vault.skills.map((s) => s.id),
        },
        feedback: {
          matchScore,
          missingSkills: missing,
        },
      };
    }
  }

  it("should successfully fulfill ResumeAnalysisService contract", async () => {
    const service = new MockResumeAnalysisService();
    const request: AnalyzeJobDescriptionRequest = {
      jobDescription: "Looking for Senior React and TypeScript developer with Docker skills",
      vault: sampleVault,
      currentConfig: sampleConfig,
    };

    const result = await service.analyzeJobDescription(request);

    expect(service.lastRequest).toEqual(request);
    expect(result.feedback.matchScore).toBe(75);
    expect(result.feedback.missingSkills).toEqual(["Docker"]);
    expect(result.suggestedConfig.selectedSkills).toHaveLength(3);
    expect(result.suggestedConfig.summary).toContain("Tailored summary for:");
  });

  it("should handle job descriptions when all required skills are present", async () => {
    const service = new MockResumeAnalysisService();
    const request: AnalyzeJobDescriptionRequest = {
      jobDescription: "React engineer needed with strong TypeScript knowledge",
      vault: sampleVault,
      currentConfig: sampleConfig,
    };

    const result = await service.analyzeJobDescription(request);

    expect(result.feedback.matchScore).toBe(95);
    expect(result.feedback.missingSkills).toEqual([]);
  });

  it("should handle error rejections in ResumeAnalysisService", async () => {
    const service = new MockResumeAnalysisService();
    service.shouldFail = true;
    service.failureMessage = "LLM rate limit exceeded";

    const request: AnalyzeJobDescriptionRequest = {
      jobDescription: "Backend developer",
      vault: sampleVault,
      currentConfig: sampleConfig,
    };

    await expect(service.analyzeJobDescription(request)).rejects.toThrow(
      "LLM rate limit exceeded",
    );
  });

  it("should handle empty job description and empty vault data edge cases", async () => {
    const service = new MockResumeAnalysisService();
    const emptyVault: VaultData = {
      basicInfo: {
        name: "",
        email: "",
        phone: "",
        linkedin: "",
      },
      skills: [],
      projects: [],
      experience: [],
      certificates: [],
      awards: [],
    };

    const emptyConfig: ResumeConfig = {
      targetRole: "",
      targetCompany: "",
      summary: "",
      selectedSkills: [],
      selectedProjects: [],
      selectedExperience: [],
      selectedCerts: [],
      selectedAwards: [],
      sectionOrder: [],
    };

    const request: AnalyzeJobDescriptionRequest = {
      jobDescription: "",
      vault: emptyVault,
      currentConfig: emptyConfig,
    };

    const result = await service.analyzeJobDescription(request);

    expect(result).toBeDefined();
    expect(result.feedback.matchScore).toBe(95);
    expect(result.suggestedConfig.selectedSkills).toEqual([]);
  });

  it("should support multiple missing skills in feedback result", async () => {
    const service = new MockResumeAnalysisService();
    const request: AnalyzeJobDescriptionRequest = {
      jobDescription: "Requires docker and graphql knowledge along with full-stack skills",
      vault: sampleVault,
      currentConfig: sampleConfig,
    };

    const result = await service.analyzeJobDescription(request);

    expect(result.feedback.missingSkills).toContain("Docker");
    expect(result.feedback.missingSkills).toContain("GraphQL");
    expect(result.feedback.missingSkills.length).toBe(2);
  });
});
