import * as repo from "./userTokens.repo";
import { BusinessError } from "../../utils/appError";
import { ErrorCodes } from "../../utils/errorCodes";

export const createOrUpdateUserToken = async (user_id: string, user_token: string) => {
  if (!user_id || !user_token) {
    throw new BusinessError("user_id and user_token are required", ErrorCodes.VALIDATION_ERROR);
  }
  await repo.createOrUpdateToken(user_id, user_token);
};

export const listUserTokens = async (filters: { user_id?: string }) => {
  return await repo.getTokens(filters);
};
