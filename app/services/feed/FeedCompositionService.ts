import type {
  FeedFilterRequest,
  FeedFilterType,
  FeedItem,
  FeedLayoutType,
  FeedViewState,
} from '../../interfaces/feed';

type FeedAdapter<TSource> = (item: TSource) => FeedItem;

export function composeFeedItems<TProjects, TBlogs, TVideos, TPodcasts>(params: {
  projects: TProjects[];
  blogs: TBlogs[];
  videos: TVideos[];
  podcasts: TPodcasts[];
  adaptProject: FeedAdapter<TProjects>;
  adaptBlog: FeedAdapter<TBlogs>;
  adaptVideo: FeedAdapter<TVideos>;
  adaptPodcast: FeedAdapter<TPodcasts>;
}): FeedItem[] {
  const { projects, blogs, videos, podcasts, adaptProject, adaptBlog, adaptVideo, adaptPodcast } = params;

  return [
    ...projects.map(adaptProject),
    ...blogs.map(adaptBlog),
    ...videos.map(adaptVideo),
    ...podcasts.map(adaptPodcast),
  ];
}

export function composeFeedViewState(
  layout: FeedLayoutType,
  searchQuery: string,
  filterType: FeedFilterType,
  sortLabel: string,
): FeedViewState {
  return { layout, searchQuery, filterType, sortLabel };
}

export function composeFeedFilterRequest(
  searchQuery: string,
  filterType: FeedFilterType,
  tags: string[] = [],
): FeedFilterRequest {
  return { query: searchQuery, typeFilter: filterType, tags };
}
