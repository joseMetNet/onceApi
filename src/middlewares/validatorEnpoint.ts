import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { parseMessageI18n } from "../utils/parse-messga-i18";

const validateEnpoint = (req: Request, res: Response, next: any) => {
  const error: any = validationResult(req);
  if (!error.isEmpty()) {
    const data = error.errors.map((item: any) => ({
      ...item,
      msg: parseMessageI18n(item.msg, req),
    }));

    return res
      .status(400)
      .json({ code: 400, message: parseMessageI18n("global.error_routes", req), data });
  }
  next();
};

export { validateEnpoint };