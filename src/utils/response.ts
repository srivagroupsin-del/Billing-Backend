import { Response } from "express";

interface SuccessResponseParams {
  res: Response;
  message?: string;
  data?: any;
  meta?: any;
  statusCode?: number;
}

export const successResponse = ({
  res,
  message = "Operation successful",
  data = {},
  meta = {},
  statusCode = 200,
}: SuccessResponseParams) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

export const paginationResponse = (res: Response, data: any[], total: number, page: number, limit: number, message = "Data fetched successfully") => {
    return successResponse({
        res,
        message,
        data,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    });
};
