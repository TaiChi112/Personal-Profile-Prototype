import { describe, it, expect } from "bun:test";
import {
  asSkillId,
  asProjectId,
  asExperienceId,
  asCertificateId,
  asAwardId,
  asResumeId,
  type BasicInfo,
  type VaultSkill,
  type VaultProject,
  type VaultExperience,
  type VaultCertificate,
  type VaultAward,
  type VaultData,
  type ResumeConfig,
  type SavedResume,
  type NewProjectDraft,
  type NewExperienceDraft,
  type NewCertificateDraft,
  type NewAwardDraft,
  type AiFeedback,
  type ResumeConfigSelectionKey,
  type PreviewModalState,
} from "../../../lib/resume-builder-models/models";

describe("Resume Builder Models", () => {
  describe("Branded ID factory functions", () => {
    describe("asSkillId", () => {
      it("should convert string into SkillId without mutating value", () => {
        const id = asSkillId("skill-abc-123");
        expect(id).toBe("skill-abc-123");
        expect(typeof id).toBe("string");
      });

      it("should handle empty string correctly", () => {
        const id = asSkillId("");
        expect(id).toBe("");
      });

      it("should handle special characters and whitespace", () => {
        const raw = "  skill:special/@#$  ";
        const id = asSkillId(raw);
        expect(id).toBe(raw);
      });

      it("should support string operations on branded SkillId", () => {
        const id = asSkillId("skill-1");
        expect(id.toUpperCase()).toBe("SKILL-1");
        expect(id.startsWith("skill-")).toBe(true);
        expect(`${id}-suffix`).toBe("skill-1-suffix");
      });
    });

    describe("asProjectId", () => {
      it("should convert string into ProjectId without mutating value", () => {
        const id = asProjectId("proj-789");
        expect(id).toBe("proj-789");
        expect(typeof id).toBe("string");
      });

      it("should handle UUID format", () => {
        const uuid = "550e8400-e29b-41d4-a716-446655440000";
        const id = asProjectId(uuid);
        expect(id).toBe(uuid);
      });

      it("should handle empty string", () => {
        expect(asProjectId("")).toBe("");
      });
    });

    describe("asExperienceId", () => {
      it("should convert string into ExperienceId without mutating value", () => {
        const id = asExperienceId("exp-456");
        expect(id).toBe("exp-456");
        expect(typeof id).toBe("string");
      });

      it("should handle numeric string IDs", () => {
        const id = asExperienceId("998822");
        expect(id).toBe("998822");
      });
    });

    describe("asCertificateId", () => {
      it("should convert string into CertificateId without mutating value", () => {
        const id = asCertificateId("cert-aws-saa");
        expect(id).toBe("cert-aws-saa");
        expect(typeof id).toBe("string");
      });

      it("should handle unicode string IDs", () => {
        const id = asCertificateId("ใบรับรอง-01");
        expect(id).toBe("ใบรับรอง-01");
      });
    });

    describe("asAwardId", () => {
      it("should convert string into AwardId without mutating value", () => {
        const id = asAwardId("award-hackathon-2026");
        expect(id).toBe("award-hackathon-2026");
        expect(typeof id).toBe("string");
      });

      it("should handle empty and whitespace IDs", () => {
        expect(asAwardId("")).toBe("");
        expect(asAwardId("   ")).toBe("   ");
      });
    });

    describe("asResumeId", () => {
      it("should convert string into ResumeId without mutating value", () => {
        const id = asResumeId("res-frontend-senior");
        expect(id).toBe("res-frontend-senior");
        expect(typeof id).toBe("string");
      });

      it("should support equality comparison", () => {
        const id1 = asResumeId("res-1");
        const id2 = asResumeId("res-1");
        const id3 = asResumeId("res-2");

        expect(id1).toBe(id2);
        expect(id1).not.toBe(id3);
      });
    });
  });

  describe("Model fixtures and structural contracts", () => {
    describe("BasicInfo", () => {
      it("should allow valid basic info object structure", () => {
        const basicInfo: BasicInfo = {
          name: "Chaiwat Somchai",
          email: "chaiwat@example.com",
          phone: "+66 81 234 5678",
          linkedin: "https://linkedin.com/in/chaiwat",
        };

        expect(basicInfo.name).toBe("Chaiwat Somchai");
        expect(basicInfo.email).toBe("chaiwat@example.com");
        expect(basicInfo.phone).toBe("+66 81 234 5678");
        expect(basicInfo.linkedin).toBe("https://linkedin.com/in/chaiwat");
      });
    });

    describe("VaultSkill", () => {
      it("should allow creating skills with default and custom categories", () => {
        const defaultCategorySkill: VaultSkill = {
          id: asSkillId("skill-ts"),
          name: "TypeScript",
          category: "programming",
        };

        const customCategorySkill: VaultSkill = {
          id: asSkillId("skill-k8s"),
          name: "Kubernetes",
          category: "cloud-native",
        };

        expect(defaultCategorySkill.id).toBe("skill-ts");
        expect(defaultCategorySkill.category).toBe("programming");
        expect(customCategorySkill.id).toBe("skill-k8s");
        expect(customCategorySkill.category).toBe("cloud-native");
      });
    });

    describe("VaultProject", () => {
      it("should support project with projectUrl", () => {
        const project: VaultProject = {
          id: asProjectId("proj-portfolio"),
          title: "Personal Portfolio",
          duration: "2025 - Present",
          description: "Full-stack portfolio with Next.js",
          projectUrl: "https://portfolio.example.com",
        };

        expect(project.title).toBe("Personal Portfolio");
        expect(project.projectUrl).toBe("https://portfolio.example.com");
      });

      it("should support project without optional projectUrl", () => {
        const project: VaultProject = {
          id: asProjectId("proj-internal"),
          title: "Internal Tooling",
          duration: "2024",
          description: "CLI scripts for automation",
        };

        expect(project.projectUrl).toBeUndefined();
      });
    });

    describe("VaultExperience", () => {
      it("should validate work experience object structure", () => {
        const experience: VaultExperience = {
          id: asExperienceId("exp-lead"),
          company: "Enterprise Corp",
          role: "Senior Full Stack Engineer",
          duration: "2023 - 2026",
          responsibilities: "Led architectural migration and monorepo tooling",
        };

        expect(experience.company).toBe("Enterprise Corp");
        expect(experience.role).toBe("Senior Full Stack Engineer");
        expect(experience.responsibilities).toContain("architectural migration");
      });
    });

    describe("VaultCertificate", () => {
      it("should validate certificate object structure", () => {
        const cert: VaultCertificate = {
          id: asCertificateId("cert-1"),
          name: "AWS Certified Solutions Architect",
          year: "2025",
        };

        expect(cert.name).toBe("AWS Certified Solutions Architect");
        expect(cert.year).toBe("2025");
      });
    });

    describe("VaultAward", () => {
      it("should validate award object structure", () => {
        const award: VaultAward = {
          id: asAwardId("award-1"),
          name: "Hackathon Winner",
          desc: "1st place in National AI Competition",
        };

        expect(award.name).toBe("Hackathon Winner");
        expect(award.desc).toBe("1st place in National AI Competition");
      });
    });

    describe("VaultData", () => {
      it("should contain all sub-collections and basicInfo", () => {
        const vault: VaultData = {
          basicInfo: {
            name: "John Doe",
            email: "john@example.com",
            phone: "123-456-7890",
            linkedin: "https://linkedin.com/in/johndoe",
          },
          skills: [
            {
              id: asSkillId("s-1"),
              name: "React",
              category: "frameworks",
            },
          ],
          projects: [
            {
              id: asProjectId("p-1"),
              title: "Project Alpha",
              duration: "2024",
              description: "Alpha project",
            },
          ],
          experience: [
            {
              id: asExperienceId("e-1"),
              company: "Tech Co",
              role: "Developer",
              duration: "2022 - 2024",
              responsibilities: "Developing features",
            },
          ],
          certificates: [
            {
              id: asCertificateId("c-1"),
              name: "CKA",
              year: "2024",
            },
          ],
          awards: [
            {
              id: asAwardId("a-1"),
              name: "Excellence Award",
              desc: "Quarterly award",
            },
          ],
        };

        expect(vault.basicInfo.name).toBe("John Doe");
        expect(vault.skills.length).toBe(1);
        expect(vault.projects.length).toBe(1);
        expect(vault.experience.length).toBe(1);
        expect(vault.certificates.length).toBe(1);
        expect(vault.awards.length).toBe(1);
      });
    });

    describe("ResumeConfig and ResumeConfigSelectionKey", () => {
      it("should validate resume configuration structure", () => {
        const config: ResumeConfig = {
          targetRole: "Senior Backend Engineer",
          targetCompany: "Google",
          summary: "Experienced backend engineer specializing in distributed systems.",
          selectedSkills: [asSkillId("s-1"), asSkillId("s-2")],
          selectedProjects: [asProjectId("p-1")],
          selectedExperience: [asExperienceId("e-1")],
          selectedCerts: [asCertificateId("c-1")],
          selectedAwards: [asAwardId("a-1")],
          sectionOrder: ["experience", "projects", "skills", "certificates", "awards"],
        };

        expect(config.targetRole).toBe("Senior Backend Engineer");
        expect(config.selectedSkills).toHaveLength(2);
        expect(config.sectionOrder).toEqual([
          "experience",
          "projects",
          "skills",
          "certificates",
          "awards",
        ]);
      });

      it("should validate ResumeConfigSelectionKey type keys", () => {
        const selectionKeys: ResumeConfigSelectionKey[] = [
          "selectedSkills",
          "selectedProjects",
          "selectedExperience",
          "selectedCerts",
          "selectedAwards",
        ];

        expect(selectionKeys.length).toBe(5);
        const config: ResumeConfig = {
          targetRole: "DevOps Engineer",
          targetCompany: "Cloud Org",
          summary: "Summary text",
          selectedSkills: [asSkillId("s-1")],
          selectedProjects: [],
          selectedExperience: [],
          selectedCerts: [],
          selectedAwards: [],
          sectionOrder: ["skills"],
        };

        selectionKeys.forEach((key) => {
          expect(Array.isArray(config[key])).toBe(true);
        });
      });
    });

    describe("SavedResume", () => {
      it("should validate minimal SavedResume structure", () => {
        const minimalResume: SavedResume = {
          id: asResumeId("resume-min-1"),
          title: "Software Engineer Resume",
          date: "2026-10-05",
          status: "Draft",
          visibility: "private",
          config: {
            targetRole: "Software Engineer",
            targetCompany: "Acme",
            summary: "Experienced engineer",
            selectedSkills: [],
            selectedProjects: [],
            selectedExperience: [],
            selectedCerts: [],
            selectedAwards: [],
            sectionOrder: ["skills", "experience"],
          },
        };

        expect(minimalResume.id).toBe("resume-min-1");
        expect(minimalResume.authorName).toBeUndefined();
        expect(minimalResume.authorAvatarUrl).toBeUndefined();
        expect(minimalResume.vaultData).toBeUndefined();
      });

      it("should validate full SavedResume structure with optional fields", () => {
        const fullResume: SavedResume = {
          id: asResumeId("resume-full-1"),
          title: "Staff Engineer Resume",
          date: "2026-10-05",
          status: "Applied",
          visibility: "public",
          authorName: "Alice Smith",
          authorAvatarUrl: "https://example.com/avatar.png",
          config: {
            targetRole: "Staff Engineer",
            targetCompany: "Enterprise",
            summary: "High scale architecture",
            selectedSkills: [asSkillId("s-1")],
            selectedProjects: [asProjectId("p-1")],
            selectedExperience: [asExperienceId("e-1")],
            selectedCerts: [],
            selectedAwards: [],
            sectionOrder: ["experience", "skills"],
          },
          vaultData: {
            basicInfo: {
              name: "Alice Smith",
              email: "alice@example.com",
              phone: "555-0100",
              linkedin: "https://linkedin.com/in/alicesmith",
            },
            skills: [{ id: asSkillId("s-1"), name: "Go", category: "programming" }],
            projects: [],
            experience: [],
            certificates: [],
            awards: [],
          },
        };

        expect(fullResume.authorName).toBe("Alice Smith");
        expect(fullResume.authorAvatarUrl).toBe("https://example.com/avatar.png");
        expect(fullResume.vaultData?.skills).toHaveLength(1);
      });
    });

    describe("Draft types", () => {
      it("should validate NewProjectDraft with and without projectUrl", () => {
        const draftWithUrl: NewProjectDraft = {
          title: "Next.js App",
          startDate: "2025-01-01",
          endDate: "2025-06-01",
          description: "Full stack dashboard",
          projectUrl: "https://example.com/app",
        };
        expect(draftWithUrl.projectUrl).toBe("https://example.com/app");

        const draftWithoutUrl: NewProjectDraft = {
          title: "Backend API",
          startDate: "2025-02-01",
          endDate: "2025-05-01",
          description: "Microservice API",
        };
        expect(draftWithoutUrl.projectUrl).toBeUndefined();
      });

      it("should validate NewExperienceDraft", () => {
        const experienceDraft: NewExperienceDraft = {
          company: "Tech Corp",
          role: "Frontend Lead",
          startDate: "2024-01-01",
          endDate: "2025-01-01",
          responsibilities: "Built design systems and UI features",
        };

        expect(experienceDraft.company).toBe("Tech Corp");
        expect(experienceDraft.role).toBe("Frontend Lead");
      });

      it("should validate NewCertificateDraft", () => {
        const certDraft: NewCertificateDraft = {
          name: "Certified Kubernetes Administrator",
          year: "2025",
        };

        expect(certDraft.name).toBe("Certified Kubernetes Administrator");
        expect(certDraft.year).toBe("2025");
      });

      it("should validate NewAwardDraft", () => {
        const awardDraft: NewAwardDraft = {
          name: "Employee of the Year",
          desc: "Recognized for exceptional technical leadership",
        };

        expect(awardDraft.name).toBe("Employee of the Year");
        expect(awardDraft.desc).toBe("Recognized for exceptional technical leadership");
      });
    });

    describe("AiFeedback", () => {
      it("should validate AiFeedback properties", () => {
        const feedback: AiFeedback = {
          matchScore: 85,
          missingSkills: ["Kubernetes", "GraphQL"],
        };

        expect(feedback.matchScore).toBe(85);
        expect(feedback.missingSkills).toEqual(["Kubernetes", "GraphQL"]);
      });

      it("should validate perfect match score with no missing skills", () => {
        const perfectFeedback: AiFeedback = {
          matchScore: 100,
          missingSkills: [],
        };

        expect(perfectFeedback.matchScore).toBe(100);
        expect(perfectFeedback.missingSkills).toHaveLength(0);
      });
    });

    describe("PreviewModalState", () => {
      it("should represent closed modal state", () => {
        const closedState: PreviewModalState = { kind: "closed" };
        expect(closedState.kind).toBe("closed");
      });

      it("should represent open modal state with attached SavedResume", () => {
        const resume: SavedResume = {
          id: asResumeId("res-preview-1"),
          title: "Preview Resume",
          date: "2026-10-05",
          status: "Draft",
          visibility: "public",
          config: {
            targetRole: "Full Stack Engineer",
            targetCompany: "Startup",
            summary: "Versatile developer",
            selectedSkills: [],
            selectedProjects: [],
            selectedExperience: [],
            selectedCerts: [],
            selectedAwards: [],
            sectionOrder: [],
          },
        };

        const openState: PreviewModalState = {
          kind: "open",
          resume,
        };

        expect(openState.kind).toBe("open");
        if (openState.kind === "open") {
          expect(openState.resume.id).toBe("res-preview-1");
          expect(openState.resume.title).toBe("Preview Resume");
        }
      });
    });
  });
});
