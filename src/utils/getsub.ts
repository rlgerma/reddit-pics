// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getSub(sub: string): Promise<any> {
  try {
    const req = await fetch(`https://www.reddit.com/r/${sub}/.json?jsonp=`);
    if (req.ok) return req.json();
    else throw new Error(req.statusText);
  } catch (error) {
    return error;
  }
}
