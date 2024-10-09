import { RedditAllPosts } from "../components/types";

export async function getSub(sub: string, after?: string): Promise<RedditAllPosts | undefined> {
  try {
    const req = await fetch(
      `https://www.reddit.com/r/${sub}/hot/.json?limit=100?${after ? `&after=${after}` : ""}`
    );
    if (req.ok) return req.json();
    else throw new Error(req.statusText);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return undefined;
  }
}
