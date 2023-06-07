import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponsType } from "pages/libs/server/withHandler";
import { withIronSessionApiRoute } from "iron-session/next";
import client from "pages/libs/server/client";
import { withApiSession } from "pages/libs/server/withSession";
import favorite from "pages/api/products/[id]/favorite";


async function handler(req: NextApiRequest, res: NextApiResponse<ResponsType>) {
  const {
    session: { user },
  } = req;
  const purchases  = await client.purchase.findMany({
    where:{
      userId: user?.id
    },
    include:{
      product:{
        include:{
          _count:{
            select:{
              favorite:true
            }
          }
        }
      }
    }
  })
  res.json({
    ok: true,
    purchases,
  });
}
export default withApiSession(withHandler({
  methods:["GET"],
  handler,
  isPrivate:true,
}));
