import { catchAsync } from "../../utils/catchAsync";
import { successResponse } from "../../utils/response";
import { BusinessError } from "../../utils/appError";
import { ErrorCodes } from "../../utils/errorCodes";
import { Request, Response } from "express";
import * as service from "./audit.service";

/* GET ACTION COUNTS */
export const getAuditCounts = catchAsync(async (
  req: Request,
  res: Response
) => {
  const { module, record_id } = req.query;

  if (!module || !record_id) {
    throw new BusinessError("module and record_id are required", ErrorCodes.BUSINESS_RULE_VIOLATION);
  }

  const data = await service.fetchActionCounts(
    String(module),
    Number(record_id)
  );

  successResponse({ res, data: data });
});

/* GET FULL HISTORY */
export const getAuditHistory = catchAsync(async (
  req: Request,
  res: Response
) => {
  const { module, record_id } = req.query;

  if (!module || !record_id) {
    throw new BusinessError("module and record_id are required", ErrorCodes.BUSINESS_RULE_VIOLATION);
  }

  const data = await service.fetchHistory(
    String(module),
    Number(record_id)
  );

  successResponse({ res, data: data });
});
