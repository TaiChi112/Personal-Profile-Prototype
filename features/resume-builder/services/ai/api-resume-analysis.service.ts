import type {
  AnalyzeJobDescriptionRequest,
  AnalyzeJobDescriptionResult,
  ResumeAnalysisService,
} from "@uaps/shared/resume-builder";

// AI backend is not migrated yet.
const analyzeResumeBuilderJobDescription = async (_req: AnalyzeJobDescriptionRequest) => ({ ok: false, statusCode: 501, message: "AI features are not supported in the prototype yet.", data: null });

export class ResumeAnalysisRequestError extends Error {
  readonly statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "ResumeAnalysisRequestError";
    this.statusCode = statusCode;
  }
}

const toResumeAnalysisError = (
  statusCode?: number,
  message?: string,
): ResumeAnalysisRequestError => {
  if (statusCode === 401) {
    return new ResumeAnalysisRequestError(
      "Please sign in to use AI analysis.",
      statusCode,
    );
  }

  if (statusCode === 403) {
    return new ResumeAnalysisRequestError(
      "You do not have permission to use AI analysis.",
      statusCode,
    );
  }

  if (message?.trim()) {
    return new ResumeAnalysisRequestError(
      `Analysis failed: ${message}`,
      statusCode,
    );
  }

  return new ResumeAnalysisRequestError(
    "Analysis failed. Please try again in a moment.",
    statusCode,
  );
};

export class ApiResumeAnalysisService implements ResumeAnalysisService {
  async analyzeJobDescription(
    request: AnalyzeJobDescriptionRequest,
  ): Promise<AnalyzeJobDescriptionResult> {
    const result = await analyzeResumeBuilderJobDescription(request);

    if (!result.ok || !result.data) {
      throw toResumeAnalysisError(
        result.statusCode,
        result.message ?? "Failed to analyze the job description",
      );
    }

    return result.data;
  }
}
