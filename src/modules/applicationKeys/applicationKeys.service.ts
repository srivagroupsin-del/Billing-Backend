import * as repo from "./applicationKeys.repo";
import { BusinessError } from "../../utils/appError";
import { ErrorCodes } from "../../utils/errorCodes";

export const createOrUpdateApplicationKey = async (app_id: string, app_key: string) => {
  if (!app_id || !app_key) {
    throw new BusinessError("app_id and app_key are required", ErrorCodes.VALIDATION_ERROR);
  }
  await repo.createOrUpdateAppKey(app_id, app_key);
};

export const listApplicationKeys = async (filters: { app_id?: string }) => {
  return await repo.getAppKeys(filters);
};
