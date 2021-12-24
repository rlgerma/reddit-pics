// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function readHistory(): Promise<any[] | null> {
  try {
    const history = localStorage.getItem("history");
    if (history) return JSON.parse(history);
    else throw new Error("History not found");
  } catch (error) {
    console.warn(error);
    return null;
  }
}
