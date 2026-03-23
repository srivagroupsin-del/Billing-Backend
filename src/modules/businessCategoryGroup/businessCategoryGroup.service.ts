import * as repo from "./businessCategoryGroup.repository";
import { logAudit } from "../audit/audit.service";

export const getBusinessCategoryGroups = async (
  businessId: number
) => {
  const rows: any = await repo.getBusinessCategoryGroups(businessId);

  if (!rows || rows.length === 0) {
    return {
      business_id: businessId,
      business_name: null,
      category_groups: [],
    };
  }

  return {
    business_id: rows[0].business_id,
    business_name: rows[0].business_name,
    category_groups: rows.map((row: any) => ({
      id: row.category_group_id,
      name: row.category_group_name,
      assigned_at: row.created,
    })),
  };
};
