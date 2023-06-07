import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponsType } from "pages/libs/server/withHandler";
import { withIronSessionApiRoute } from "iron-session/next";
import client from "pages/libs/server/client";
import { withApiSession } from "pages/libs/server/withSession";
import useSWR from "swr";


async function handler(req: NextApiRequest, res: NextApiResponse<ResponsType>) {
  const {
    session: { user },
  } = req;
  const sold = await client.sold.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      product: {
        include: {
          _count: {
            select: {
              favorite: true,
            },
          },
        },
      },
    },
  });
  res.json({
    ok: true,
    sold,
  });
}
export default withApiSession(withHandler({
  methods:["GET"],
  handler,
  isPrivate:true,
}));
