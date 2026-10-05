import { describe, it, expect, beforeEach } from "bun:test";
import {
  asAwardId,
  asCertificateId,
  asExperienceId,
  asProjectId,
  asResumeId,
  asSkillId,
  type AwardId,
  type CertificateId,
  type ExperienceId,
  type ProjectId,
  type ResumeId,
  type SkillId,
  type VaultAward,
  type VaultCertificate,
  type VaultExperience,
  type VaultProject,
  type VaultSkill,
  type SavedResume,
  type VaultData,
  type ResumeConfig,
} from "../../../lib/resume-builder-models/models";
import type { FeatureResumeStatus } from "../../../lib/resume-builder-models/enums";
import type {
  CreateSkillInput,
  NewAwardDraft,
  NewCertificateDraft,
  NewExperienceDraft,
  NewProjectDraft,
  RepositorySource,
  ResumeBuilderSnapshot,
  UpsertSavedResumeInput,
  VaultRepository,
} from "../../../lib/resume-builder-models/repository";

describe("Vault Repository Interface & Data Contracts", () => {
  describe("RepositorySource types", () => {
    it("should allow valid repository sources", () => {
      const validSources: RepositorySource[] = ["mock", "api", "hybrid"];
      expect(validSources).toContain("mock");
      expect(validSources).toContain("api");
      expect(validSources).toContain("hybrid");
    });
  });

  describe("Input contracts", () => {
    it("should validate CreateSkillInput structure", () => {
      const input: CreateSkillInput = {
        name: "Rust",
        category: "programming",
      };
      expect(input.name).toBe("Rust");
      expect(input.category).toBe("programming");
    });

    it("should validate UpsertSavedResumeInput with and without optional fields", () => {
      const minimalInput: UpsertSavedResumeInput = {
        title: "Default Resume",
        date: "2026-10-05",
        status: "Draft",
        config: {
          targetRole: "Engineer",
          targetCompany: "Co",
          summary: "Summary",
          selectedSkills: [],
          selectedProjects: [],
          selectedExperience: [],
          selectedCerts: [],
          selectedAwards: [],
          sectionOrder: [],
        },
      };
      expect(minimalInput.resumeId).toBeUndefined();
      expect(minimalInput.visibility).toBeUndefined();

      const fullInput: UpsertSavedResumeInput = {
        resumeId: asResumeId("res-1"),
        title: "Updated Resume",
        date: "2026-10-05",
        status: "Applied",
        visibility: "public",
        config: minimalInput.config,
      };
      expect(fullInput.resumeId).toBe("res-1");
      expect(fullInput.visibility).toBe("public");
    });
  });

  describe("In-Memory VaultRepository implementation", () => {
    class InMemoryVaultRepository implements VaultRepository {
      private source: RepositorySource = "mock";
      private skills: VaultSkill[] = [];
      private projects: VaultProject[] = [];
      private experience: VaultExperience[] = [];
      private certificates: VaultCertificate[] = [];
      private awards: VaultAward[] = [];
      private resumes: SavedResume[] = [];
      private nextId = 1;

      async loadSnapshot(): Promise<ResumeBuilderSnapshot> {
        const vault: VaultData = {
          basicInfo: {
            name: "Test User",
            email: "test@example.com",
            phone: "123456789",
            linkedin: "https://linkedin.com/in/test",
          },
          skills: [...this.skills],
          projects: [...this.projects],
          experience: [...this.experience],
          certificates: [...this.certificates],
          awards: [...this.awards],
        };

        return {
          source: this.source,
          vault,
          savedResumes: [...this.resumes],
        };
      }

      async createSkill(input: CreateSkillInput): Promise<VaultSkill> {
        const skill: VaultSkill = {
          id: asSkillId(`skill-${this.nextId++}`),
          name: input.name,
          category: input.category,
        };
        this.skills.push(skill);
        return skill;
      }

      async updateSkill(
        skillId: SkillId,
        input: CreateSkillInput,
      ): Promise<VaultSkill> {
        const index = this.skills.findIndex((s) => s.id === skillId);
        if (index === -1) {
          throw new Error(`Skill ${skillId} not found`);
        }
        const updated: VaultSkill = {
          id: skillId,
          name: input.name,
          category: input.category,
        };
        this.skills[index] = updated;
        return updated;
      }

      async deleteSkill(skillId: SkillId): Promise<boolean> {
        const index = this.skills.findIndex((s) => s.id === skillId);
        if (index === -1) { return false; }
        this.skills.splice(index, 1);
        return true;
      }

      async createProject(input: NewProjectDraft): Promise<VaultProject> {
        const project: VaultProject = {
          id: asProjectId(`proj-${this.nextId++}`),
          title: input.title,
          duration: `${input.startDate} - ${input.endDate}`,
          description: input.description,
          projectUrl: input.projectUrl,
        };
        this.projects.push(project);
        return project;
      }

      async updateProject(
        projectId: ProjectId,
        input: NewProjectDraft,
      ): Promise<VaultProject> {
        const index = this.projects.findIndex((p) => p.id === projectId);
        if (index === -1) {
          throw new Error(`Project ${projectId} not found`);
        }
        const updated: VaultProject = {
          id: projectId,
          title: input.title,
          duration: `${input.startDate} - ${input.endDate}`,
          description: input.description,
          projectUrl: input.projectUrl,
        };
        this.projects[index] = updated;
        return updated;
      }

      async deleteProject(projectId: ProjectId): Promise<boolean> {
        const index = this.projects.findIndex((p) => p.id === projectId);
        if (index === -1) { return false; }
        this.projects.splice(index, 1);
        return true;
      }

      async createExperience(
        input: NewExperienceDraft,
      ): Promise<VaultExperience> {
        const exp: VaultExperience = {
          id: asExperienceId(`exp-${this.nextId++}`),
          company: input.company,
          role: input.role,
          duration: `${input.startDate} - ${input.endDate}`,
          responsibilities: input.responsibilities,
        };
        this.experience.push(exp);
        return exp;
      }

      async updateExperience(
        experienceId: ExperienceId,
        input: NewExperienceDraft,
      ): Promise<VaultExperience> {
        const index = this.experience.findIndex((e) => e.id === experienceId);
        if (index === -1) {
          throw new Error(`Experience ${experienceId} not found`);
        }
        const updated: VaultExperience = {
          id: experienceId,
          company: input.company,
          role: input.role,
          duration: `${input.startDate} - ${input.endDate}`,
          responsibilities: input.responsibilities,
        };
        this.experience[index] = updated;
        return updated;
      }

      async deleteExperience(experienceId: ExperienceId): Promise<boolean> {
        const index = this.experience.findIndex((e) => e.id === experienceId);
        if (index === -1) { return false; }
        this.experience.splice(index, 1);
        return true;
      }

      async createCertificate(
        input: NewCertificateDraft,
      ): Promise<VaultCertificate> {
        const cert: VaultCertificate = {
          id: asCertificateId(`cert-${this.nextId++}`),
          name: input.name,
          year: input.year,
        };
        this.certificates.push(cert);
        return cert;
      }

      async updateCertificate(
        certificateId: CertificateId,
        input: NewCertificateDraft,
      ): Promise<VaultCertificate> {
        const index = this.certificates.findIndex((c) => c.id === certificateId);
        if (index === -1) {
          throw new Error(`Certificate ${certificateId} not found`);
        }
        const updated: VaultCertificate = {
          id: certificateId,
          name: input.name,
          year: input.year,
        };
        this.certificates[index] = updated;
        return updated;
      }

      async deleteCertificate(certificateId: CertificateId): Promise<boolean> {
        const index = this.certificates.findIndex((c) => c.id === certificateId);
        if (index === -1) { return false; }
        this.certificates.splice(index, 1);
        return true;
      }

      async createAward(input: NewAwardDraft): Promise<VaultAward> {
        const award: VaultAward = {
          id: asAwardId(`award-${this.nextId++}`),
          name: input.name,
          desc: input.desc,
        };
        this.awards.push(award);
        return award;
      }

      async updateAward(
        awardId: AwardId,
        input: NewAwardDraft,
      ): Promise<VaultAward> {
        const index = this.awards.findIndex((a) => a.id === awardId);
        if (index === -1) {
          throw new Error(`Award ${awardId} not found`);
        }
        const updated: VaultAward = {
          id: awardId,
          name: input.name,
          desc: input.desc,
        };
        this.awards[index] = updated;
        return updated;
      }

      async deleteAward(awardId: AwardId): Promise<boolean> {
        const index = this.awards.findIndex((a) => a.id === awardId);
        if (index === -1) { return false; }
        this.awards.splice(index, 1);
        return true;
      }

      async saveResume(input: UpsertSavedResumeInput): Promise<SavedResume> {
        if (input.resumeId) {
          const index = this.resumes.findIndex((r) => r.id === input.resumeId);
          if (index !== -1) {
            const updated: SavedResume = {
              ...this.resumes[index],
              title: input.title,
              date: input.date,
              status: input.status,
              visibility: input.visibility ?? this.resumes[index].visibility,
              config: input.config,
            };
            this.resumes[index] = updated;
            return updated;
          }
        }

        const newResume: SavedResume = {
          id: input.resumeId ?? asResumeId(`resume-${this.nextId++}`),
          title: input.title,
          date: input.date,
          status: input.status,
          visibility: input.visibility ?? "private",
          config: input.config,
        };
        this.resumes.push(newResume);
        return newResume;
      }

      async duplicateResume(
        resumeId: ResumeId,
        duplicatedAt: string,
      ): Promise<SavedResume | null> {
        const source = this.resumes.find((r) => r.id === resumeId);
        if (!source) { return null; }

        const duplicated: SavedResume = {
          ...source,
          id: asResumeId(`resume-${this.nextId++}`),
          title: `${source.title} (Copy)`,
          date: duplicatedAt,
          status: "Draft",
        };
        this.resumes.push(duplicated);
        return duplicated;
      }

      async deleteResume(resumeId: ResumeId): Promise<boolean> {
        const index = this.resumes.findIndex((r) => r.id === resumeId);
        if (index === -1) { return false; }
        this.resumes.splice(index, 1);
        return true;
      }

      async updateResumeStatus(
        resumeId: ResumeId,
        status: FeatureResumeStatus,
      ): Promise<SavedResume | null> {
        const resume = this.resumes.find((r) => r.id === resumeId);
        if (!resume) { return null; }
        resume.status = status;
        return resume;
      }

      async updateResumeVisibility(
        resumeId: ResumeId,
        visibility: string,
      ): Promise<SavedResume | null> {
        const resume = this.resumes.find((r) => r.id === resumeId);
        if (!resume) { return null; }
        resume.visibility = visibility;
        return resume;
      }

      async getPublicResumes(): Promise<SavedResume[]> {
        return this.resumes.filter((r) => r.visibility === "public");
      }
    }

    let repo: InMemoryVaultRepository;

    beforeEach(() => {
      repo = new InMemoryVaultRepository();
    });

    describe("Snapshot Operations", () => {
      it("should return empty snapshot initially", async () => {
        const snapshot = await repo.loadSnapshot();
        expect(snapshot.source).toBe("mock");
        expect(snapshot.vault.skills).toEqual([]);
        expect(snapshot.vault.projects).toEqual([]);
        expect(snapshot.savedResumes).toEqual([]);
      });
    });

    describe("Skill Operations", () => {
      it("should create, update, and delete skill", async () => {
        const skill = await repo.createSkill({
          name: "TypeScript",
          category: "programming",
        });
        expect(skill.id).toBeDefined();
        expect(skill.name).toBe("TypeScript");

        const updated = await repo.updateSkill(skill.id, {
          name: "TypeScript 5",
          category: "programming",
        });
        expect(updated.name).toBe("TypeScript 5");

        const deleted = await repo.deleteSkill(skill.id);
        expect(deleted).toBe(true);

        const deleteNonExistent = await repo.deleteSkill(skill.id);
        expect(deleteNonExistent).toBe(false);
      });

      it("should throw error when updating non-existent skill", async () => {
        await expect(
          repo.updateSkill(asSkillId("non-existent"), {
            name: "React",
            category: "frameworks",
          }),
        ).rejects.toThrow("Skill non-existent not found");
      });
    });

    describe("Project Operations", () => {
      it("should create, update, and delete project", async () => {
        const project = await repo.createProject({
          title: "AI Factory Monorepo",
          startDate: "2025-01",
          endDate: "2026-10",
          description: "Enterprise Monorepo architecture",
          projectUrl: "https://github.com/example/repo",
        });
        expect(project.id).toBeDefined();
        expect(project.duration).toBe("2025-01 - 2026-10");

        const updated = await repo.updateProject(project.id, {
          title: "AI Factory Monorepo v2",
          startDate: "2025-01",
          endDate: "Present",
          description: "Updated architecture",
        });
        expect(updated.title).toBe("AI Factory Monorepo v2");
        expect(updated.duration).toBe("2025-01 - Present");

        const deleted = await repo.deleteProject(project.id);
        expect(deleted).toBe(true);

        const deleteNonExistent = await repo.deleteProject(project.id);
        expect(deleteNonExistent).toBe(false);
      });

      it("should throw error when updating non-existent project", async () => {
        await expect(
          repo.updateProject(asProjectId("p-none"), {
            title: "Test",
            startDate: "2025",
            endDate: "2026",
            description: "Test",
          }),
        ).rejects.toThrow("Project p-none not found");
      });
    });

    describe("Experience Operations", () => {
      it("should create, update, and delete experience", async () => {
        const exp = await repo.createExperience({
          company: "Enterprise Inc",
          role: "Lead QA",
          startDate: "2024-01",
          endDate: "2026-01",
          responsibilities: "Automated test pipelines",
        });
        expect(exp.id).toBeDefined();
        expect(exp.company).toBe("Enterprise Inc");

        const updated = await repo.updateExperience(exp.id, {
          company: "Enterprise Inc",
          role: "Principal QA Engineer",
          startDate: "2024-01",
          endDate: "Present",
          responsibilities: "End to end quality engineering",
        });
        expect(updated.role).toBe("Principal QA Engineer");

        const deleted = await repo.deleteExperience(exp.id);
        expect(deleted).toBe(true);
        expect(await repo.deleteExperience(exp.id)).toBe(false);
      });

      it("should throw error when updating non-existent experience", async () => {
        await expect(
          repo.updateExperience(asExperienceId("exp-none"), {
            company: "None",
            role: "None",
            startDate: "",
            endDate: "",
            responsibilities: "",
          }),
        ).rejects.toThrow("Experience exp-none not found");
      });
    });

    describe("Certificate Operations", () => {
      it("should create, update, and delete certificate", async () => {
        const cert = await repo.createCertificate({
          name: "CKAD",
          year: "2024",
        });
        expect(cert.id).toBeDefined();
        expect(cert.name).toBe("CKAD");

        const updated = await repo.updateCertificate(cert.id, {
          name: "CKA",
          year: "2025",
        });
        expect(updated.name).toBe("CKA");
        expect(updated.year).toBe("2025");

        const deleted = await repo.deleteCertificate(cert.id);
        expect(deleted).toBe(true);
        expect(await repo.deleteCertificate(cert.id)).toBe(false);
      });

      it("should throw error when updating non-existent certificate", async () => {
        await expect(
          repo.updateCertificate(asCertificateId("cert-none"), {
            name: "AWS",
            year: "2024",
          }),
        ).rejects.toThrow("Certificate cert-none not found");
      });
    });

    describe("Award Operations", () => {
      it("should create, update, and delete award", async () => {
        const award = await repo.createAward({
          name: "Best Innovation",
          desc: "For developer tooling",
        });
        expect(award.id).toBeDefined();
        expect(award.name).toBe("Best Innovation");

        const updated = await repo.updateAward(award.id, {
          name: "Best Innovation 2026",
          desc: "Grand prize winner",
        });
        expect(updated.name).toBe("Best Innovation 2026");

        const deleted = await repo.deleteAward(award.id);
        expect(deleted).toBe(true);
        expect(await repo.deleteAward(award.id)).toBe(false);
      });

      it("should throw error when updating non-existent award", async () => {
        await expect(
          repo.updateAward(asAwardId("a-none"), {
            name: "None",
            desc: "None",
          }),
        ).rejects.toThrow("Award a-none not found");
      });
    });

    describe("Resume Operations", () => {
      const sampleConfig: ResumeConfig = {
        targetRole: "Staff Engineer",
        targetCompany: "Big Tech",
        summary: "Architecture leader",
        selectedSkills: [asSkillId("s-1")],
        selectedProjects: [],
        selectedExperience: [],
        selectedCerts: [],
        selectedAwards: [],
        sectionOrder: ["skills"],
      };

      it("should save new resume when resumeId is omitted", async () => {
        const resume = await repo.saveResume({
          title: "My Tech Resume",
          date: "2026-10-05",
          status: "Draft",
          config: sampleConfig,
        });

        expect(resume.id).toBeDefined();
        expect(resume.title).toBe("My Tech Resume");
        expect(resume.visibility).toBe("private");
      });

      it("should update existing resume when resumeId is provided", async () => {
        const initial = await repo.saveResume({
          title: "Initial Title",
          date: "2026-10-01",
          status: "Draft",
          visibility: "private",
          config: sampleConfig,
        });

        const updated = await repo.saveResume({
          resumeId: initial.id,
          title: "Updated Title",
          date: "2026-10-05",
          status: "Applied",
          visibility: "public",
          config: {
            ...sampleConfig,
            summary: "Updated summary",
          },
        });

        expect(updated.id).toBe(initial.id);
        expect(updated.title).toBe("Updated Title");
        expect(updated.status).toBe("Applied");
        expect(updated.visibility).toBe("public");
        expect(updated.config.summary).toBe("Updated summary");
      });

      it("should duplicate resume with (Copy) appended to title", async () => {
        const original = await repo.saveResume({
          title: "Senior Role",
          date: "2026-10-01",
          status: "Interviewing",
          config: sampleConfig,
        });

        const duplicated = await repo.duplicateResume(original.id, "2026-10-05");
        expect(duplicated).not.toBeNull();
        expect(duplicated?.id).not.toBe(original.id);
        expect(duplicated?.title).toBe("Senior Role (Copy)");
        expect(duplicated?.status).toBe("Draft");
        expect(duplicated?.date).toBe("2026-10-05");
      });

      it("should return null when duplicating non-existent resume", async () => {
        const result = await repo.duplicateResume(
          asResumeId("does-not-exist"),
          "2026-10-05",
        );
        expect(result).toBeNull();
      });

      it("should delete existing resume and return false for unknown id", async () => {
        const resume = await repo.saveResume({
          title: "Delete Me",
          date: "2026-10-05",
          status: "Draft",
          config: sampleConfig,
        });

        const deleted = await repo.deleteResume(resume.id);
        expect(deleted).toBe(true);

        const deleteAgain = await repo.deleteResume(resume.id);
        expect(deleteAgain).toBe(false);
      });

      it("should update status and return null if not found", async () => {
        const resume = await repo.saveResume({
          title: "Job Hunter",
          date: "2026-10-05",
          status: "Draft",
          config: sampleConfig,
        });

        const updated = await repo.updateResumeStatus(resume.id, "Applied");
        expect(updated?.status).toBe("Applied");

        const unknown = await repo.updateResumeStatus(
          asResumeId("unknown-id"),
          "Interviewing",
        );
        expect(unknown).toBeNull();
      });

      it("should update visibility and return null if not found", async () => {
        const resume = await repo.saveResume({
          title: "Visibility Check",
          date: "2026-10-05",
          status: "Draft",
          visibility: "private",
          config: sampleConfig,
        });

        const updated = await repo.updateResumeVisibility(resume.id, "public");
        expect(updated?.visibility).toBe("public");

        const unknown = await repo.updateResumeVisibility(
          asResumeId("unknown-id"),
          "public",
        );
        expect(unknown).toBeNull();
      });

      it("should filter public resumes only via getPublicResumes", async () => {
        await repo.saveResume({
          title: "Private Resume 1",
          date: "2026-10-05",
          status: "Draft",
          visibility: "private",
          config: sampleConfig,
        });

        await repo.saveResume({
          title: "Public Resume 1",
          date: "2026-10-05",
          status: "Applied",
          visibility: "public",
          config: sampleConfig,
        });

        await repo.saveResume({
          title: "Public Resume 2",
          date: "2026-10-05",
          status: "Interviewing",
          visibility: "public",
          config: sampleConfig,
        });

        const publicResumes = await repo.getPublicResumes();
        expect(publicResumes.length).toBe(2);
        expect(publicResumes.every((r) => r.visibility === "public")).toBe(true);
      });
    });
  });
});
