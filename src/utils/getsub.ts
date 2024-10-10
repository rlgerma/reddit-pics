import { RedditAllPosts, SortType } from "../components/types";

export async function getSub(
  sub: string,
  sort: SortType = "hot",
  after?: string
): Promise<RedditAllPosts | undefined> {
  try {
    const req = await fetch(
      `https://www.reddit.com/r/${sub}/${sort}/.json?limit=100?${after ? `&after=${after}` : ""}`
    );
    if (req.ok) return req.json();
    else throw new Error(req.statusText);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return undefined;
  }
}
