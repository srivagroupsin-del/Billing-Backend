export const parseJSON = (value: any) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

/* helper */
// utils/safeJsonParse.ts
export const safeJsonParse = (value: any) => {
  if (!value) return null;

  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch (err) {
    return null;
  }
};
