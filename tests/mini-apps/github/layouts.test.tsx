import { describe, it, expect, mock } from "bun:test";
import { render, fireEvent } from "@testing-library/react";

// Mock next/image to avoid optimization loader requirements in test DOM
mock.module("next/image", () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || "mocked image"} />;
  },
}));

// Mock recharts ResponsiveContainer to render children directly
mock.module("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children, data }: any) => (
    <div data-testid="pie">
      {data?.map((item: any) => (
        <span key={item.name} data-testid={`pie-slice-${item.name}`}>
          {item.name}: {item.value}
        </span>
      ))}
      {children}
    </div>
  ),
  Cell: () => null,
  Tooltip: () => null,
}));

import BentoLayout from "@/app/projects/(micro-apps)/github/layouts/BentoLayout";
import TimelineLayout from "@/app/projects/(micro-apps)/github/layouts/TimelineLayout";
import TabLayout from "@/app/projects/(micro-apps)/github/layouts/TabLayout";
import ApiCapabilitiesFooter from "@/app/projects/(micro-apps)/github/components/ApiCapabilitiesFooter";

describe("GitHub Explorer Layouts and Components", () => {
  const dummyUserData = {
    login: "torvalds",
    name: "Linus Torvalds",
    avatar_url: "https://github.com/torvalds.png",
    bio: "Creator of Linux and Git",
    company: "Linux Foundation",
    location: "Portland, OR",
    blog: "https://kernel.org",
    twitter_username: "torvalds",
    followers: 195_000,
    following: 0,
    public_repos: 7,
    created_at: "2011-09-03T15:26:22Z",
  };

  const dummyReposData = [
    { id: 1, name: "linux", language: "C", stargazers_count: 175_000, forks_count: 53_000, updated_at: "2026-10-01" },
    { id: 2, name: "git", language: "C", stargazers_count: 50_000, forks_count: 26_000, updated_at: "2026-09-20" },
    { id: 3, name: "subsurface", language: "C++", stargazers_count: 2500, forks_count: 500, updated_at: "2026-08-15" },
    { id: 4, name: "tools-ts", language: "TypeScript", stargazers_count: 1200, forks_count: 100, updated_at: "2026-07-10" },
    { id: 5, name: "script-py", language: "Python", stargazers_count: 900, forks_count: 50, updated_at: "2026-06-01" },
    { id: 6, name: "web-ui", language: "JavaScript", stargazers_count: 500, forks_count: 30, updated_at: "2026-05-01" },
    { id: 7, name: "misc-repo", language: null, stargazers_count: 10, forks_count: 1, updated_at: "2026-04-01" },
  ];

  const dummyEventsData = [
    {
      id: "evt-1",
      type: "PushEvent",
      created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      repo: { name: "torvalds/linux" },
      payload: { commits: [{ sha: "abc123456789", message: "Linux kernel update" }] },
    },
    {
      id: "evt-2",
      type: "WatchEvent",
      created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      repo: { name: "antigravity/ai-factory" },
      payload: {},
    },
    {
      id: "evt-3",
      type: "CreateEvent",
      created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      repo: { name: "torvalds/new-branch" },
      payload: { ref_type: "branch" },
    },
    {
      id: "evt-4",
      type: "IssuesEvent",
      created_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
      repo: { name: "torvalds/linux" },
      payload: { action: "opened" },
    },
    {
      id: "evt-5",
      type: "PullRequestEvent",
      created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      repo: { name: "torvalds/linux" },
      payload: { action: "closed" },
    },
    {
      id: "evt-6",
      type: "IssueCommentEvent",
      created_at: new Date(Date.now() - 15 * 3600 * 1000).toISOString(),
      repo: { name: "torvalds/linux" },
      payload: {},
    },
    {
      id: "evt-7",
      type: "ForkEvent",
      created_at: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
      repo: { name: "upstream/project" },
      payload: {},
    },
    {
      id: "evt-8",
      type: "UnknownEvent",
      created_at: new Date(Date.now() - 25 * 3600 * 1000).toISOString(),
      repo: { name: "torvalds/misc" },
      payload: {},
    },
  ];

  describe("BentoLayout", () => {
    it("should return null if userData is null", () => {
      const { container } = render(<BentoLayout userData={null} reposData={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it("should render user information and stats correctly", () => {
      const { getByText } = render(<BentoLayout userData={dummyUserData} reposData={dummyReposData} />);
      expect(getByText("Linus Torvalds")).toBeDefined();
      expect(getByText("@torvalds")).toBeDefined();
      expect(getByText("Creator of Linux and Git")).toBeDefined();
      expect(getByText("Followers")).toBeDefined();
      expect(getByText("Repos")).toBeDefined();
    });

    it("should aggregate languages and rank top languages", () => {
      const { getByTestId } = render(<BentoLayout userData={dummyUserData} reposData={dummyReposData} />);
      // C has 2 repos, C++ has 1, TypeScript has 1, Python has 1, JavaScript has 1
      expect(getByTestId("pie-slice-C")).toBeDefined();
    });

    it("should handle empty reposData gracefully", () => {
      const { getByText } = render(<BentoLayout userData={dummyUserData} reposData={[]} />);
      expect(getByText("Linus Torvalds")).toBeDefined();
    });
  });

  describe("TimelineLayout", () => {
    it("should return null if userData is null", () => {
      const { container } = render(<TimelineLayout userData={null} eventsData={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it("should render timeline events with mapped labels and relative times", () => {
      const { getByText } = render(<TimelineLayout userData={dummyUserData} eventsData={dummyEventsData} />);
      expect(getByText("Activity Feed (Last 90 Days)")).toBeDefined();
      expect(getByText(/Pushed 1 commits to/)).toBeDefined();
      expect(getByText(/Starred repository/)).toBeDefined();
      expect(getByText(/Created branch at/)).toBeDefined();
      expect(getByText(/opened an issue in/)).toBeDefined();
      expect(getByText(/closed a pull request in/)).toBeDefined();
      expect(getByText(/Commented on an issue in/)).toBeDefined();
      expect(getByText(/Forked/)).toBeDefined();
      expect(getByText(/Did UnknownEvent at/)).toBeDefined();
      expect(getByText("2 hours ago")).toBeDefined();
      expect(getByText("2 days ago")).toBeDefined();
    });

    it("should render empty state message if eventsData is empty", () => {
      const { getByText } = render(<TimelineLayout userData={dummyUserData} eventsData={[]} />);
      expect(getByText("No public activity found for this user recently.")).toBeDefined();
    });
  });

  describe("TabLayout", () => {
    it("should return null if userData is null", () => {
      const { container } = render(<TabLayout userData={null} reposData={[]} eventsData={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it("should render profile tab details by default", () => {
      const { getByText } = render(<TabLayout userData={dummyUserData} reposData={dummyReposData} eventsData={dummyEventsData} />);
      expect(getByText("About")).toBeDefined();
      expect(getByText("Linux Foundation")).toBeDefined();
      expect(getByText("Portland, OR")).toBeDefined();
      expect(getByText("https://kernel.org")).toBeDefined();
      expect(getByText("@torvalds")).toBeDefined();
    });

    it("should switch to repositories tab and back to profile tab", () => {
      const { getByText } = render(<TabLayout userData={dummyUserData} reposData={dummyReposData} eventsData={dummyEventsData} />);
      const repoTabBtn = getByText(/Repositories/);
      fireEvent.click(repoTabBtn);
      expect(getByText("linux")).toBeDefined();
      
      const profileTabBtn = getByText("Profile Details");
      fireEvent.click(profileTabBtn);
      expect(getByText("About")).toBeDefined();
    });

    it("should display empty repositories message when reposData is empty in repos tab", () => {
      const { getByText } = render(<TabLayout userData={dummyUserData} reposData={[]} eventsData={[]} />);
      const repoTabBtn = getByText(/Repositories/);
      fireEvent.click(repoTabBtn);
      expect(getByText("No repositories found.")).toBeDefined();
    });

    it("should handle missing optional fields with fallback dashes", () => {
      const minimalUser = {
        login: "simpleuser",
        name: null,
        avatar_url: null,
        bio: null,
        company: null,
        location: null,
        blog: null,
        twitter_username: null,
        created_at: "2022-01-01T00:00:00Z",
      };
      const { getAllByText } = render(<TabLayout userData={minimalUser} reposData={[]} eventsData={[]} />);
      expect(getAllByText("-").length).toBeGreaterThan(0);
    });

    it("should handle blog url without http protocol prefix", () => {
      const userWithRawBlog = {
        ...dummyUserData,
        blog: "linustorvalds.org",
      };
      const { getByText } = render(<TabLayout userData={userWithRawBlog} reposData={[]} eventsData={[]} />);
      const blogLink = getByText("linustorvalds.org") as HTMLAnchorElement;
      expect(blogLink.getAttribute("href")).toBe("https://linustorvalds.org");
    });
  });

  describe("ApiCapabilitiesFooter", () => {
    it("should render API documentation categories and endpoints", () => {
      const { getByText } = render(<ApiCapabilitiesFooter />);
      expect(getByText("Explore the GitHub Public API Menu")).toBeDefined();
      expect(getByText("User Analytics")).toBeDefined();
      expect(getByText("Repository Deep Dive")).toBeDefined();
      expect(getByText("Specialized Metadata")).toBeDefined();
    });
  });
});
