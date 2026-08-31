-- CreateTable
CREATE TABLE "resume_download_leads" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "company" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "downloaded_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_download_leads_pkey" PRIMARY KEY ("id")
);
