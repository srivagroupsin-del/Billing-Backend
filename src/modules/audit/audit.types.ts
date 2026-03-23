export type AuditAction = "create" | "update" | "delete";

export interface CreateAuditInput {
  user_id: number;
  module: string;
  record_id: number;
  action: AuditAction;
  old_data?: any;
  new_data?: any;
}
