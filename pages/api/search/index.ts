import { NextApiRequest, NextApiResponse } from "next";
import { equal } from "node:assert";
import withHandler from "libs/server/withHandler";
import { withApiSession } from "libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
    body: { find },
  } = req;

  const products = await client.product.findMany({
    where: {
      name: {
        contains: find,
      },
    },
    include:{
      _count:{
        select:{
          favorites:true,
        }
      },
      sold:true,
    },
  });

  res.json({
    ok: true,
    products,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST","GET"],
    handler,
    isPrivate: true,
  })
);
