/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { NextApiRequest, NextApiResponse } from "next";

import { injectCallBulk } from "src/api/api";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const blockHash = req.body.blockHash as string;
  const txIndex = parseInt(req.body.txIndex as string);
  const gasTimestamp = parseInt(req.body.gasTimeStamp as string);
  const code = req.body.code as string;
  const credit = parseInt(req.body.credit as string);

  const result = await injectCallBulk(
    blockHash,
    txIndex,
    gasTimestamp,
    code,
    credit
  );
  res.status(200).json(result);
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
