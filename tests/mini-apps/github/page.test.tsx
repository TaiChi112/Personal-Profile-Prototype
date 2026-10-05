import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import { render, fireEvent, waitFor } from "@testing-library/react";

// Mock next/image to avoid loader issues
mock.module("next/image", () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || "mocked image"} />;
  },
}));

// Mock recharts
mock.module("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  PieChart: ({ children }: any) => <div>{children}</div>,
  Pie: ({ children }: any) => <div>{children}</div>,
  Cell: () => null,
  Tooltip: () => null,
}));

import GithubExplorer from "@/app/projects/(micro-apps)/github/page";
import { useGithubStore } from "@/app/projects/(micro-apps)/github/store/useGithubStore";

describe("GithubExplorer Page Component", () => {
  const originalFetch = globalThis.fetch;
  const originalAlert = globalThis.alert;
  let mockAlert: ReturnType<typeof mock>;

  beforeEach(() => {
    useGithubStore.setState({
      searchQuery: "",
      layoutMode: "BENTO",
      userPat: "",
      userData: null,
      reposData: [],
      eventsData: [],
    });

    mockAlert = mock();
    globalThis.alert = mockAlert as any;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    globalThis.alert = originalAlert;
  });

  it("should mount and load a random profile when no userData is present", async () => {
    const dummyUser = { login: "torvalds", name: "Linus Torvalds" };
    const dummyRepos = [{ id: 1, name: "linux" }];
    const dummyEvents = [{ id: "ev-1", type: "PushEvent" }];

    globalThis.fetch = mock((url: string) => {
      if (url.includes("/repos")) {
        return Promise.resolve({ json: () => Promise.resolve(dummyRepos) } as any);
      }
      if (url.includes("/events")) {
        return Promise.resolve({ json: () => Promise.resolve(dummyEvents) } as any);
      }
      return Promise.resolve({ json: () => Promise.resolve(dummyUser) } as any);
    }) as any;

    render(<GithubExplorer />);

    await waitFor(() => {
      expect(useGithubStore.getState().userData).toEqual(dummyUser);
      expect(useGithubStore.getState().reposData).toEqual(dummyRepos);
      expect(useGithubStore.getState().eventsData).toEqual(dummyEvents);
    });
  });

  it("should perform search when submitting the search form", async () => {
    const searchUser = { login: "gaearon", name: "Dan Abramov" };
    globalThis.fetch = mock((url: string) => {
      if (url.includes("/repos")) {
        return Promise.resolve({ json: () => Promise.resolve([]) } as any);
      }
      if (url.includes("/events")) {
        return Promise.resolve({ json: () => Promise.resolve([]) } as any);
      }
      return Promise.resolve({ json: () => Promise.resolve(searchUser) } as any);
    }) as any;

    const { getByPlaceholderText, getByText } = render(<GithubExplorer />);

    const searchInput = getByPlaceholderText("Search GitHub username...");
    fireEvent.change(searchInput, { target: { value: "gaearon" } });

    const searchButton = getByText("Search");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(useGithubStore.getState().userData).toEqual(searchUser);
    });
  });

  it("should include Authorization header when userPat is provided", async () => {
    let capturedHeaders: any = null;
    globalThis.fetch = mock((_url: string, init?: any) => {
      capturedHeaders = init?.headers;
      return Promise.resolve({ json: () => Promise.resolve({ login: "antfu" }) } as any);
    }) as any;

    const { getByPlaceholderText, getByText } = render(<GithubExplorer />);

    const patInput = getByPlaceholderText("Personal Access Token (optional)");
    fireEvent.change(patInput, { target: { value: "token_12345" } });

    const searchInput = getByPlaceholderText("Search GitHub username...");
    fireEvent.change(searchInput, { target: { value: "antfu" } });

    const searchButton = getByText("Search");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(capturedHeaders).toEqual({ Authorization: "Bearer token_12345" });
    });
  });

  it("should trigger alert when user is not found (404 message)", async () => {
    globalThis.fetch = mock(() => Promise.resolve({ json: () => Promise.resolve({ message: "Not Found" }) } as any)) as any;

    const { getByPlaceholderText, getByText } = render(<GithubExplorer />);

    const searchInput = getByPlaceholderText("Search GitHub username...");
    fireEvent.change(searchInput, { target: { value: "non-existent-user-xyz" } });

    const searchButton = getByText("Search");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("GitHub user not found!");
    });
  });

  it("should handle fetch network errors gracefully", async () => {
    const consoleErrorMock = mock();
    const originalConsoleError = console.error;
    console.error = consoleErrorMock;

    globalThis.fetch = mock(() => Promise.reject(new Error("Network Error"))) as any;

    const { getByPlaceholderText, getByText } = render(<GithubExplorer />);

    const searchInput = getByPlaceholderText("Search GitHub username...");
    fireEvent.change(searchInput, { target: { value: "testuser" } });

    const searchButton = getByText("Search");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalled();
    });

    console.error = originalConsoleError;
  });

  it("should not trigger fetch if search query is empty string or only whitespace", async () => {
    // Set userData so initial mount doesn't trigger random fetch
    useGithubStore.setState({
      userData: { login: "existing" } as any,
      searchQuery: "   ",
    });

    const fetchSpy = mock();
    globalThis.fetch = fetchSpy as any;

    const { getByText } = render(<GithubExplorer />);
    const searchButton = getByText("Search");
    fireEvent.click(searchButton);

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("should switch layouts when layout buttons are clicked", () => {
    useGithubStore.setState({
      userData: { login: "torvalds", name: "Linus" } as any,
    });

    const { getByText } = render(<GithubExplorer />);

    const tabsBtn = getByText("Tabs");
    fireEvent.click(tabsBtn);
    expect(useGithubStore.getState().layoutMode).toBe("TABS");

    const timelineBtn = getByText("Timeline");
    fireEvent.click(timelineBtn);
    expect(useGithubStore.getState().layoutMode).toBe("TIMELINE");

    const bentoBtn = getByText("Bento");
    fireEvent.click(bentoBtn);
    expect(useGithubStore.getState().layoutMode).toBe("BENTO");
  });

  it("should load a new random profile when random button is clicked", async () => {
    useGithubStore.setState({
      userData: { login: "torvalds" } as any,
      searchQuery: "torvalds",
    });

    let calledUsername = "";
    globalThis.fetch = mock((url: string) => {
      const match = url.match(/\/users\/([^/?]+)/);
      if (match) { calledUsername = match[1]; }
      return Promise.resolve({ json: () => Promise.resolve({ login: "random" }) } as any);
    }) as any;

    const { getByTitle } = render(<GithubExplorer />);
    const randomBtn = getByTitle("Load Random Top Developer");
    fireEvent.click(randomBtn);

    await waitFor(() => {
      expect(calledUsername).not.toBe("torvalds");
      expect(calledUsername.length).toBeGreaterThan(0);
    });
  });
});
