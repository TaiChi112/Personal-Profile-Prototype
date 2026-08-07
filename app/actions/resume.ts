"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  asAwardId,
  asCertificateId,
  asExperienceId,
  asProjectId,
  asResumeId,
  asSkillId,
  type FeatureResumeStatus,
  type NewProjectDraft,
  type ResumeId,
  type SavedResume,
  type UpsertSavedResumeInput,
  type VaultData,
  type VaultProject,
  type VaultSkill,
  type NewExperienceDraft,
  type VaultExperience,
  type NewCertificateDraft,
  type VaultCertificate,
  type NewAwardDraft,
  type VaultAward,
  type ResumeBuilderSnapshot
} from "@uaps/shared/resume-builder";

import type { Prisma } from "@prisma/client";
import {
  emptyVaultCollections,
  formatDuration,
  sanitizeIds,
  toBasicInfo,
  toPersistedResumeStatus,
  toSavedResume,
} from "@/lib/resume-builder/utils";

type PrismaResumeCompositionClient = Prisma.TransactionClient;

const parseSafeDate = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function loadSnapshot(): Promise<ResumeBuilderSnapshot> {
  const userId = await getUserId();
  const [vault, savedResumes] = await Promise.all([
    loadVaultData(userId),
    loadSavedResumes(userId),
  ]);

  return {
    source: "api",
    vault,
    savedResumes,
  };
}

export async function loadVaultData(userId: string): Promise<VaultData> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      resumes: { orderBy: { updatedAt: "desc" }, take: 1, include: { resumeBasic: true } },
    },
  });
  if (!user) throw new Error("User profile not found");

  const [userSkills, projects, experiences, certificates, awards] = await Promise.all([
    prisma.userSkill.findMany({ where: { userId }, include: { skill: true }, orderBy: { skill: { name: "asc" } } }),
    prisma.project.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } }),
    prisma.experience.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } }),
    prisma.certificate.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } }),
    prisma.award.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } }),
  ]);

  const latestResumeBasic = user.resumes[0]?.resumeBasic;

  return {
    basicInfo: toBasicInfo({
      name: latestResumeBasic?.fullName ?? user.name,
      email: latestResumeBasic?.email ?? user.email,
      phone: latestResumeBasic?.phone ?? "",
      linkedin: latestResumeBasic?.linkedinUrl ?? user.githubUrl ?? "",
    }),
    skills: userSkills.map((us) => ({
      id: asSkillId(us.skillId),
      name: us.skill.name,
      category: us.skill.category,
    })),
    projects: projects.map((p) => ({
      id: asProjectId(p.projectId),
      title: p.title,
      duration: formatDuration(p.startDate, p.endDate),
      description: p.description ?? "",
      projectUrl: p.projectUrl ?? undefined,
    })),
    experience: experiences.map((e) => ({
      id: asExperienceId(e.experienceId),
      company: e.organization,
      role: e.role,
      duration: formatDuration(e.startDate, e.endDate),
      responsibilities: e.achievement ?? e.description ?? "",
    })),
    certificates: certificates.length > 0 ? certificates.map((c) => ({
      id: asCertificateId(c.certificateId),
      name: c.name,
      year: c.year,
    })) : emptyVaultCollections().certificates,
    awards: awards.length > 0 ? awards.map((a) => ({
      id: asAwardId(a.awardId),
      name: a.name,
      desc: a.description,
    })) : emptyVaultCollections().awards,
  };
}

export async function loadSavedResumes(userId: string): Promise<SavedResume[]> {
  const resumes = await prisma.resume.findMany({
    where: { userId },
    include: {
      resumeBasic: true,
      resumeExperiences: true,
      resumeCertificates: true,
      resumeAwards: true,
      resumeProjects: true,
      resumeSkills: true,
      user: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return resumes.map((resume) => toSavedResume({
    resumeId: resume.resumeId,
    title: resume.versionName,
    targetJobTitle: resume.targetJobTitle,
    targetCompany: resume.targetCompany,
    summary: resume.resumeBasic?.summary,
    status: resume.status,
    updatedAt: resume.updatedAt,
    projectIds: resume.resumeProjects.map(p => p.projectId),
    skillIds: resume.resumeSkills.map(s => s.skillId),
    experienceIds: resume.resumeExperiences.map(e => e.experienceId),
    certificateIds: resume.resumeCertificates.map(c => c.certificateId),
    awardIds: resume.resumeAwards.map(a => a.awardId),
    visibility: resume.visibility,
    authorName: resume.user?.name ?? undefined,
    authorAvatarUrl: resume.user?.image ?? undefined,
    sectionOrder: resume.sectionOrder,
  }));
}

export async function createSkill(input: { category: string; name: string }): Promise<VaultSkill> {
  const userId = await getUserId();
  const skill = await prisma.$transaction(async (tx) => {
    const upsertedSkill = await tx.skill.upsert({
      where: { name: input.name.trim() },
      update: { category: input.category.trim() },
      create: { name: input.name.trim(), category: input.category.trim() },
    });
    await tx.userSkill.upsert({
      where: { userId_skillId: { userId, skillId: upsertedSkill.skillId } },
      update: {},
      create: { userId, skillId: upsertedSkill.skillId, proficiencyLevel: "Intermediate" },
    });
    return upsertedSkill;
  });
  return { id: asSkillId(skill.skillId), name: skill.name, category: skill.category };
}

export async function updateSkill(skillId: string, input: { category: string; name: string }): Promise<VaultSkill> {
  const userId = await getUserId();
  const userSkill = await prisma.userSkill.findUnique({ where: { userId_skillId: { userId, skillId } } });
  if (!userSkill) throw new Error("Skill not found for user");

  const newSkill = await prisma.skill.upsert({
    where: { name: input.name.trim() },
    update: { category: input.category.trim() },
    create: { name: input.name.trim(), category: input.category.trim() },
  });

  if (newSkill.skillId !== skillId) {
    await prisma.userSkill.delete({ where: { userId_skillId: { userId, skillId } } });
    await prisma.userSkill.upsert({
      where: { userId_skillId: { userId, skillId: newSkill.skillId } },
      update: {},
      create: { userId, skillId: newSkill.skillId, proficiencyLevel: "Intermediate" },
    });
  }
  return { id: asSkillId(newSkill.skillId), name: newSkill.name, category: newSkill.category };
}

export async function deleteSkill(skillId: string): Promise<boolean> {
  const userId = await getUserId();
  await prisma.userSkill.delete({ where: { userId_skillId: { userId, skillId } } });
  return true;
}

export async function createProject(input: NewProjectDraft): Promise<VaultProject> {
  const userId = await getUserId();
  const project = await prisma.project.create({
    data: {
      userId,
      title: input.title.trim(),
      description: input.description.trim(),
      startDate: parseSafeDate(input.startDate),
      endDate: parseSafeDate(input.endDate),
      projectUrl: input.projectUrl || null,
      status: "Completed",
      isActive: true,
    },
  });
  return { id: asProjectId(project.projectId), title: project.title, duration: formatDuration(project.startDate, project.endDate), description: project.description ?? "", projectUrl: project.projectUrl ?? undefined };
}

export async function updateProject(projectId: string, input: NewProjectDraft): Promise<VaultProject> {
  const userId = await getUserId();
  const project = await prisma.project.update({
    where: { projectId, userId },
    data: {
      title: input.title.trim(),
      description: input.description.trim(),
      startDate: parseSafeDate(input.startDate),
      endDate: parseSafeDate(input.endDate),
      projectUrl: input.projectUrl || null,
    },
  });
  return { id: asProjectId(project.projectId), title: project.title, duration: formatDuration(project.startDate, project.endDate), description: project.description ?? "", projectUrl: project.projectUrl ?? undefined };
}

export async function deleteProject(projectId: string): Promise<boolean> {
  const userId = await getUserId();
  await prisma.project.delete({ where: { projectId, userId } });
  return true;
}

export async function createExperience(input: NewExperienceDraft): Promise<VaultExperience> {
  const userId = await getUserId();
  const experience = await prisma.experience.create({
    data: {
      userId,
      organization: input.company.trim(),
      role: input.role.trim(),
      startDate: parseSafeDate(input.startDate),
      endDate: parseSafeDate(input.endDate),
      description: input.responsibilities.trim(),
    },
  });
  return { id: asExperienceId(experience.experienceId), company: experience.organization, role: experience.role, duration: formatDuration(experience.startDate, experience.endDate), responsibilities: experience.description ?? "" };
}

export async function updateExperience(experienceId: string, input: NewExperienceDraft): Promise<VaultExperience> {
  const userId = await getUserId();
  const experience = await prisma.experience.update({
    where: { experienceId, userId },
    data: {
      organization: input.company.trim(),
      role: input.role.trim(),
      startDate: parseSafeDate(input.startDate),
      endDate: parseSafeDate(input.endDate),
      description: input.responsibilities.trim(),
    },
  });
  return { id: asExperienceId(experience.experienceId), company: experience.organization, role: experience.role, duration: formatDuration(experience.startDate, experience.endDate), responsibilities: experience.description ?? "" };
}

export async function deleteExperience(experienceId: string): Promise<boolean> {
  const userId = await getUserId();
  await prisma.experience.delete({ where: { experienceId, userId } });
  return true;
}

export async function createCertificate(input: NewCertificateDraft): Promise<VaultCertificate> {
  const userId = await getUserId();
  const certificate = await prisma.certificate.create({
    data: { userId, name: input.name.trim(), year: input.year.trim() },
  });
  return { id: asCertificateId(certificate.certificateId), name: certificate.name, year: certificate.year ?? "" };
}

export async function updateCertificate(certificateId: string, input: NewCertificateDraft): Promise<VaultCertificate> {
  const userId = await getUserId();
  const certificate = await prisma.certificate.update({
    where: { certificateId, userId },
    data: { name: input.name.trim(), year: input.year.trim() },
  });
  return { id: asCertificateId(certificate.certificateId), name: certificate.name, year: certificate.year ?? "" };
}

export async function deleteCertificate(certificateId: string): Promise<boolean> {
  const userId = await getUserId();
  await prisma.certificate.delete({ where: { certificateId, userId } });
  return true;
}

export async function createAward(input: NewAwardDraft): Promise<VaultAward> {
  const userId = await getUserId();
  const award = await prisma.award.create({
    data: { userId, name: input.name.trim(), description: input.desc.trim() },
  });
  return { id: asAwardId(award.awardId), name: award.name, desc: award.description ?? "" };
}

export async function updateAward(awardId: string, input: NewAwardDraft): Promise<VaultAward> {
  const userId = await getUserId();
  const award = await prisma.award.update({
    where: { awardId, userId },
    data: { name: input.name.trim(), description: input.desc.trim() },
  });
  return { id: asAwardId(award.awardId), name: award.name, desc: award.description ?? "" };
}

export async function deleteAward(awardId: string): Promise<boolean> {
  const userId = await getUserId();
  await prisma.award.delete({ where: { awardId, userId } });
  return true;
}

async function setResumeComposition(tx: PrismaResumeCompositionClient, userId: string, resumeId: string, config: UpsertSavedResumeInput["config"]) {
  await Promise.all([
    tx.resumeAward.deleteMany({ where: { resumeId } }),
    tx.resumeCertificate.deleteMany({ where: { resumeId } }),
    tx.resumeProject.deleteMany({ where: { resumeId } }),
    tx.resumeSkill.deleteMany({ where: { resumeId } }),
    tx.resumeExperience.deleteMany({ where: { resumeId } }),
  ]);

  const reqProjects = sanitizeIds(config.selectedProjects.map(String));
  const reqSkills = sanitizeIds(config.selectedSkills.map(String));
  const reqExp = sanitizeIds(config.selectedExperience.map(String));
  const reqCerts = sanitizeIds(config.selectedCerts.map(String));
  const reqAwards = sanitizeIds(config.selectedAwards.map(String));

  await Promise.all([
    reqProjects.length > 0 ? tx.resumeProject.createMany({ data: reqProjects.map(id => ({ resumeId, projectId: id })) }) : null,
    reqSkills.length > 0 ? tx.resumeSkill.createMany({ data: reqSkills.map(id => ({ resumeId, skillId: id })) }) : null,
    reqExp.length > 0 ? tx.resumeExperience.createMany({ data: reqExp.map(id => ({ resumeId, experienceId: id })) }) : null,
    reqCerts.length > 0 ? tx.resumeCertificate.createMany({ data: reqCerts.map(id => ({ resumeId, certificateId: id })) }) : null,
    reqAwards.length > 0 ? tx.resumeAward.createMany({ data: reqAwards.map(id => ({ resumeId, awardId: id })) }) : null,
  ]);
}

export async function saveResume(input: UpsertSavedResumeInput): Promise<SavedResume> {
  const userId = await getUserId();
  const savedResumeId = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId }, include: { resumes: { orderBy: { updatedAt: "desc" }, take: 1, include: { resumeBasic: true } } } });
    if (!user) throw new Error("User profile not found");

    const persistedStatus = toPersistedResumeStatus(input.status);
    const savedResume = input.resumeId
      ? await (async () => {
          const existing = await tx.resume.findFirst({ where: { userId, resumeId: String(input.resumeId) } });
          if (!existing) throw new Error("Resume not found");
          return tx.resume.update({
            where: { resumeId: existing.resumeId },
            data: { versionName: input.title, targetJobTitle: input.config.targetRole || null, targetCompany: input.config.targetCompany || null, status: persistedStatus, sectionOrder: input.config.sectionOrder || ["skills", "projects", "experience", "certificates", "awards"] },
          });
        })()
      : await tx.resume.create({
          data: { versionName: input.title, targetJobTitle: input.config.targetRole || null, targetCompany: input.config.targetCompany || null, userId, visibility: "private", isActive: false, status: persistedStatus, sectionOrder: input.config.sectionOrder || ["skills", "projects", "experience", "certificates", "awards"] },
        });

    await tx.resumeBasic.upsert({
      where: { resumeId: savedResume.resumeId },
      update: {
        fullName: user.resumes[0]?.resumeBasic?.fullName ?? user.name ?? "",
        email: user.resumes[0]?.resumeBasic?.email ?? user.email,
        phone: user.resumes[0]?.resumeBasic?.phone ?? null,
        linkedinUrl: user.resumes[0]?.resumeBasic?.linkedinUrl ?? user.githubUrl,
        summary: input.config.summary || null,
      },
      create: {
        resumeId: savedResume.resumeId,
        fullName: user.resumes[0]?.resumeBasic?.fullName ?? user.name ?? "",
        email: user.resumes[0]?.resumeBasic?.email ?? user.email,
        phone: user.resumes[0]?.resumeBasic?.phone ?? null,
        linkedinUrl: user.resumes[0]?.resumeBasic?.linkedinUrl ?? user.githubUrl,
        summary: input.config.summary || null,
      },
    });

    await setResumeComposition(tx, userId, savedResume.resumeId, input.config);
    return savedResume.resumeId;
  });

  const resumes = await loadSavedResumes(userId);
  const result = resumes.find(r => r.id === savedResumeId);
  if (!result) throw new Error("Saved resume could not be reloaded");
  return result;
}

export async function duplicateResume(resumeId: ResumeId, duplicatedAt: string): Promise<SavedResume | null> {
  const userId = await getUserId();
  const resumes = await loadSavedResumes(userId);
  const existing = resumes.find(r => r.id === resumeId);
  if (!existing) return null;

  const duplicated = await saveResume({
    title: `${existing.title} (Copy)`,
    date: duplicatedAt,
    status: "Draft",
    config: existing.config,
  });

  return { ...duplicated, date: duplicatedAt };
}

export async function deleteResume(resumeId: ResumeId): Promise<boolean> {
  const userId = await getUserId();
  const deleted = await prisma.resume.deleteMany({ where: { userId, resumeId: String(resumeId) } });
  return deleted.count > 0;
}

export async function updateResumeStatus(resumeId: ResumeId, status: FeatureResumeStatus): Promise<SavedResume | null> {
  const userId = await getUserId();
  const resumes = await loadSavedResumes(userId);
  const existing = resumes.find(r => r.id === resumeId);
  if (!existing) return null;

  return saveResume({
    resumeId,
    title: existing.title,
    date: existing.date,
    status,
    config: existing.config,
  });
}

export async function updateResumeVisibility(resumeId: ResumeId, visibility: string): Promise<SavedResume | null> {
  const userId = await getUserId();
  await prisma.resume.updateMany({ where: { resumeId: String(resumeId), userId }, data: { visibility } });
  const resumes = await loadSavedResumes(userId);
  return resumes.find(r => r.id === resumeId) ?? null;
}

export async function getPublicResumes(): Promise<SavedResume[]> {
  const resumes = await prisma.resume.findMany({
    where: { visibility: "public" },
    include: {
      resumeBasic: true,
      resumeExperiences: true,
      resumeCertificates: true,
      resumeAwards: true,
      resumeProjects: true,
      resumeSkills: true,
      user: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  const result: SavedResume[] = [];
  for (const resume of resumes) {
    const vault = await loadVaultData(resume.userId);
    const filteredVault: VaultData = {
      basicInfo: vault.basicInfo,
      skills: vault.skills.filter(s => resume.resumeSkills.some(rs => rs.skillId === s.id)),
      projects: vault.projects.filter(p => resume.resumeProjects.some(rp => rp.projectId === p.id)),
      experience: vault.experience.filter(e => resume.resumeExperiences.some(re => re.experienceId === e.id)),
      certificates: vault.certificates.filter(c => resume.resumeCertificates.some(rc => rc.certificateId === c.id)),
      awards: vault.awards.filter(a => resume.resumeAwards.some(ra => ra.awardId === a.id)),
    };

    const savedResume = toSavedResume({
      resumeId: resume.resumeId,
      title: resume.versionName,
      targetJobTitle: resume.targetJobTitle,
      targetCompany: resume.targetCompany,
      summary: resume.resumeBasic?.summary,
      status: resume.status,
      updatedAt: resume.updatedAt,
      projectIds: resume.resumeProjects.map(p => p.projectId),
      skillIds: resume.resumeSkills.map(s => s.skillId),
      experienceIds: resume.resumeExperiences.map(e => e.experienceId),
      certificateIds: resume.resumeCertificates.map(c => c.certificateId),
      awardIds: resume.resumeAwards.map(a => a.awardId),
      visibility: resume.visibility,
      authorName: resume.user?.name ?? undefined,
      authorAvatarUrl: resume.user?.image ?? undefined,
      sectionOrder: resume.sectionOrder,
    });
    savedResume.vaultData = filteredVault;
    result.push(savedResume);
  }
  return result;
}
