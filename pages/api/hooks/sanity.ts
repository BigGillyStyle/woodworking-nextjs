import { isValidRequest } from "@sanity/webhook";
import { NextApiRequest, NextApiResponse } from "next";
import logger from "../../../logger/logger";

const secret = process.env.SANITY_WEBHOOK_SECRET;

type Data = {
  success: boolean;
  message?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    logger.error(
      { req, res },
      "Received /api/hooks/sanity with invalid HTTP method"
    );
    return res
      .status(401)
      .json({ success: false, message: "Must be a POST request" });
  }

  if (!isValidRequest(req, secret as string)) {
    logger.error(
      { req, res },
      "Received /api/hooks/sanity with invalid signature"
    );
    res.status(401).json({ success: false, message: "Invalid signature" });
    return;
  }

  logger.info({ req, res }, "Received /api/hooks/sanity");
  res.json({ success: true });
}
