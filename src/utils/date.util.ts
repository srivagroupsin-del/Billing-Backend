// utils/date.util.ts
export const toMySQLDateTime = (iso: string) => {
  const date = new Date(iso);
  return date.toISOString().slice(0, 19).replace("T", " ");
};
