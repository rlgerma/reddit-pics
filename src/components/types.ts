
export interface RedditAllPosts {
    data : {
        children: RedditPostsMap[]
    }
}

export interface RedditPostsMap {
    data: {
      thumbnail: string | string[];
      title?: string;
      url: string | undefined;
      author: string;
    };
  }

  export interface RedditSinglePost {
    permalink?: string | null | undefined;
    url?: string | undefined;
    ups?: number | undefined;
    all_awardings?: {
        icon_url: string;
        count: number;
        name: string;
    }[] | undefined;
    thumbnail?: string | string[] | undefined;
    title?: string | undefined;
    author?: string | undefined;
    created_utc?: number | undefined;
 }

  export interface RedditSinglePostComments {
      data: {
          author: string;
            body: string;
            created_utc: number;
            ups: number;
      }
  }