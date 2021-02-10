import type { NextApiRequest, NextApiResponse } from "next";

import { getLatestBlocks } from "src/api/api";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const blocks = await getLatestBlocks();
  res.status(200).json(blocks);
};
