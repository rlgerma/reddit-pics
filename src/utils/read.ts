// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function readStorage(name: string): Promise<any[] | undefined> {
  try {
    const storageItem = localStorage.getItem(name);
    if (storageItem) return JSON.parse(storageItem);
    else throw new Error(`${name} not found`);
  } catch (error) {
    if (error instanceof Error) console.warn(error.message);
    return undefined;
  }
}
