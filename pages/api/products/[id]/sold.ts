import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponsType } from "libs/server/withHandler";
import client from "libs/server/client";
import { withApiSession } from "libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponsType>) {
  const {
    query: { id },
    session: { user },
  } = req;

  const alreadyExist = await client.sold.findFirst({
    where: {
      productId: id + "",
    },
  });

  if (alreadyExist.saleIs===true) {
    await client.sold.update({
      where: {
        id: alreadyExist.id,
      },
      data: {
        saleIs: false,
      },
    });
  } else {
    await client.sold.update({
      where: {
        id: alreadyExist.id,
      },
      data: {
        saleIs: true,
      },
    });
  }
  res.json({
    ok: true,
  });
}
export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: true,
  })
);
