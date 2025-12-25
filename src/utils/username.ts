export const normalizeUsername = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

export const isValidUsername = (username: string) =>
  /^[a-z0-9_]{3,20}$/.test(username);
