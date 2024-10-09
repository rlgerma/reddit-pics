// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getSub(sub: string, after?: string): Promise<any> {
  try {
    const req = await fetch(
      `https://www.reddit.com/r/${sub}/hot/.json?limit=100?${after ? `&after=${after}` : ""}`
    );
    if (req.ok) return req.json();
    else throw new Error(req.statusText);
  } catch (error) {
    return error;
  }
}
