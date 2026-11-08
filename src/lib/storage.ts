export const readList = (key: string): string[] => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(key) || "[]") as string[]; }
  catch { return []; }
};

export const writeList = (key: string, value: string[]) => {
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(value));
};

export const readBooks = <T,>(key: string): T[] => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(key) || "[]") as T[]; }
  catch { return []; }
};

export const writeBooks = <T,>(key: string, value: T[]) => {
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(value));
};
