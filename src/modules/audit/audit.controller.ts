import { Request, Response } from "express";
import * as service from "./audit.service";

/* GET ACTION COUNTS */
export const getAuditCounts = async (
  req: Request,
  res: Response
) => {
  const { module, record_id } = req.query;

  if (!module || !record_id) {
    return res.status(400).json({
      success: false,
      message: "module and record_id are required",
    });
  }

  const data = await service.fetchActionCounts(
    String(module),
    Number(record_id)
  );

  res.json({ success: true, data });
};

/* GET FULL HISTORY */
export const getAuditHistory = async (
  req: Request,
  res: Response
) => {
  const { module, record_id } = req.query;

  if (!module || !record_id) {
    return res.status(400).json({
      success: false,
      message: "module and record_id are required",
    });
  }

  const data = await service.fetchHistory(
    String(module),
    Number(record_id)
  );

  res.json({ success: true, data });
};
