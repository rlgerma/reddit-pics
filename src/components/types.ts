export type SortType = 'hot' | 'new' | 'top' | 'rising' | 'controversial';

export interface RedditAllPosts {
  data: {
    after?: string;
    children: RedditPostsMap[];
  };
}

export interface RedditPostsMap {
  data: {
    thumbnail: string;
    title?: string;
    url: string | undefined;
    author: string;
    created_utc?: number;
  };
}

export interface RedditSinglePost {
  permalink?: string | null;
  url?: string;
  ups?: number;
  all_awardings?: {
    icon_url: string;
    count: number;
    name: string;
  }[];
  thumbnail?: string | string[];
  title?: string;
  author?: string;
  created_utc?: number;
}

export interface RedditSinglePostComments {
  data: {
    author: string;
    body: string;
    body_html: string;
    created_utc: number;
    ups: number;
    all_awardings?: {
      icon_url: string;
      count: number;
      name: string;
    }[];
    replies: {
      data: {
        children: RedditSinglePostComments[];
      };
    };
  };
}
