import * as repo from "./audit.repository";
import { CreateAuditInput } from "./audit.types";

/* LOG AUDIT */
export const logAudit = async (data: CreateAuditInput) => {
  await repo.insertAudit(data);
};

/* GET COUNTS */
export const fetchActionCounts = async (
  module: string,
  recordId: number
) => {
  return repo.getActionCounts(module, recordId);
};

/* GET HISTORY */
export const fetchHistory = async (
  module: string,
  recordId: number
) => {
  return repo.getHistory(module, recordId);
};
