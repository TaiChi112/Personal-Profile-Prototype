import { describe, it, expect, beforeEach } from "bun:test";
import { useGithubStore } from "@/app/projects/(micro-apps)/github/store/useGithubStore";

describe("useGithubStore Zustand Store", () => {
  beforeEach(() => {
    // Reset store state before each test
    useGithubStore.setState({
      searchQuery: "",
      layoutMode: "BENTO",
      userPat: "",
      userData: null,
      reposData: [],
      eventsData: [],
    });
  });

  it("should have correct initial default state", () => {
    const state = useGithubStore.getState();
    expect(state.searchQuery).toBe("");
    expect(state.layoutMode).toBe("BENTO");
    expect(state.userPat).toBe("");
    expect(state.userData).toBeNull();
    expect(state.reposData).toEqual([]);
    expect(state.eventsData).toEqual([]);
  });

  it("should update searchQuery with setSearchQuery", () => {
    useGithubStore.getState().setSearchQuery("torvalds");
    expect(useGithubStore.getState().searchQuery).toBe("torvalds");

    useGithubStore.getState().setSearchQuery("");
    expect(useGithubStore.getState().searchQuery).toBe("");
  });

  it("should update layoutMode with setLayoutMode", () => {
    useGithubStore.getState().setLayoutMode("TABS");
    expect(useGithubStore.getState().layoutMode).toBe("TABS");

    useGithubStore.getState().setLayoutMode("TIMELINE");
    expect(useGithubStore.getState().layoutMode).toBe("TIMELINE");

    useGithubStore.getState().setLayoutMode("BENTO");
    expect(useGithubStore.getState().layoutMode).toBe("BENTO");
  });

  it("should update userPat with setUserPat", () => {
    useGithubStore.getState().setUserPat("ghp_secretToken12345");
    expect(useGithubStore.getState().userPat).toBe("ghp_secretToken12345");
  });

  it("should update userData with setUserData", () => {
    const dummyUserData = {
      login: "octocat",
      id: 583_231,
      name: "The Octocat",
      company: "@github",
      blog: "https://github.blog",
      location: "San Francisco",
      bio: "GitHub mascot",
      public_repos: 8,
      followers: 10_000,
      following: 9,
      created_at: "2011-01-25T18:44:36Z",
    };

    useGithubStore.getState().setUserData(dummyUserData);
    expect(useGithubStore.getState().userData).toEqual(dummyUserData);
  });

  it("should update reposData with setReposData", () => {
    const dummyRepos = [
      { id: 1, name: "repo-alpha", language: "TypeScript", stargazers_count: 50 },
      { id: 2, name: "repo-beta", language: "Rust", stargazers_count: 120 },
    ];

    useGithubStore.getState().setReposData(dummyRepos);
    expect(useGithubStore.getState().reposData).toEqual(dummyRepos);
  });

  it("should update eventsData with setEventsData", () => {
    const dummyEvents = [
      { id: "e1", type: "PushEvent", repo: { name: "test/repo" } },
      { id: "e2", type: "WatchEvent", repo: { name: "test/popular" } },
    ];

    useGithubStore.getState().setEventsData(dummyEvents);
    expect(useGithubStore.getState().eventsData).toEqual(dummyEvents);
  });
});
