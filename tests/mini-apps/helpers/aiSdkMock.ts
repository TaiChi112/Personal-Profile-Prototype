import { mock } from "bun:test";

export const mockGenerateObject = mock();
export const mockStreamText = mock();
export const mockGoogleModel = mock(() => "mock-gemini-model");

export function registerAiSdkMocks(): void {
  mock.module("ai", () => ({
    generateObject: mockGenerateObject,
    streamText: mockStreamText,
    tool: (definition: unknown) => definition,
  }));

  mock.module("@ai-sdk/google", () => ({
    google: mockGoogleModel,
  }));
}
