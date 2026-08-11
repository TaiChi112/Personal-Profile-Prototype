import type {
  CreateSkillInput,
  FeatureResumeStatus,
  NewAwardDraft,
  NewCertificateDraft,
  NewExperienceDraft,
  NewProjectDraft,
  ResumeBuilderSnapshot,
  ResumeId,
  SavedResume,
  UpsertSavedResumeInput,
  VaultProject,
  VaultRepository,
  VaultSkill,
  VaultExperience,
  VaultCertificate,
  VaultAward,
} from "@uaps/shared/resume-builder";

import * as actions from "@/app/actions/resume";

export class ApiVaultRepository implements VaultRepository {
  async loadSnapshot(): Promise<ResumeBuilderSnapshot> {
    return actions.loadSnapshot();
  }

  async createSkill(input: CreateSkillInput): Promise<VaultSkill> {
    return actions.createSkill(input);
  }

  async updateSkill(skillId: import("@uaps/shared/resume-builder").SkillId, input: CreateSkillInput): Promise<VaultSkill> {
    return actions.updateSkill(String(skillId), input);
  }

  async deleteSkill(skillId: import("@uaps/shared/resume-builder").SkillId): Promise<boolean> {
    return actions.deleteSkill(String(skillId));
  }

  async createProject(input: NewProjectDraft): Promise<VaultProject> {
    return actions.createProject(input);
  }

  async updateProject(projectId: import("@uaps/shared/resume-builder").ProjectId, input: NewProjectDraft): Promise<VaultProject> {
    return actions.updateProject(String(projectId), input);
  }

  async deleteProject(projectId: import("@uaps/shared/resume-builder").ProjectId): Promise<boolean> {
    return actions.deleteProject(String(projectId));
  }

  async createExperience(input: NewExperienceDraft): Promise<VaultExperience> {
    return actions.createExperience(input);
  }

  async updateExperience(experienceId: import("@uaps/shared/resume-builder").ExperienceId, input: NewExperienceDraft): Promise<VaultExperience> {
    return actions.updateExperience(String(experienceId), input);
  }

  async deleteExperience(experienceId: import("@uaps/shared/resume-builder").ExperienceId): Promise<boolean> {
    return actions.deleteExperience(String(experienceId));
  }

  async createCertificate(input: NewCertificateDraft): Promise<VaultCertificate> {
    return actions.createCertificate(input);
  }

  async updateCertificate(certificateId: import("@uaps/shared/resume-builder").CertificateId, input: NewCertificateDraft): Promise<VaultCertificate> {
    return actions.updateCertificate(String(certificateId), input);
  }

  async deleteCertificate(certificateId: import("@uaps/shared/resume-builder").CertificateId): Promise<boolean> {
    return actions.deleteCertificate(String(certificateId));
  }

  async createAward(input: NewAwardDraft): Promise<VaultAward> {
    return actions.createAward(input);
  }

  async updateAward(awardId: import("@uaps/shared/resume-builder").AwardId, input: NewAwardDraft): Promise<VaultAward> {
    return actions.updateAward(String(awardId), input);
  }

  async deleteAward(awardId: import("@uaps/shared/resume-builder").AwardId): Promise<boolean> {
    return actions.deleteAward(String(awardId));
  }

  async saveResume(input: UpsertSavedResumeInput): Promise<SavedResume> {
    return actions.saveResume(input);
  }

  async duplicateResume(resumeId: ResumeId, duplicatedAt: string): Promise<SavedResume | null> {
    return actions.duplicateResume(resumeId, duplicatedAt);
  }

  async deleteResume(resumeId: ResumeId): Promise<boolean> {
    return actions.deleteResume(resumeId);
  }

  async updateResumeStatus(resumeId: ResumeId, status: FeatureResumeStatus): Promise<SavedResume | null> {
    return actions.updateResumeStatus(resumeId, status);
  }

  async updateResumeVisibility(resumeId: ResumeId, visibility: string): Promise<SavedResume | null> {
    return actions.updateResumeVisibility(resumeId, visibility);
  }

  async getPublicResumes(): Promise<SavedResume[]> {
    return actions.getPublicResumes();
  }
}
