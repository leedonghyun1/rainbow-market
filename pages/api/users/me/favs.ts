import { NextApiRequest, NextApiResponse } from "next";
import products from "pages/api/products";
import withHandler from "libs/server/withHandler";
import { withApiSession } from "libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "GET") {
    const {
      session: { user },
    } = req;

    const favs = await client.favorite.findMany({
      where: {
        userId: user?.id,
      },
      select: {
        product:{
          include:{
            _count:{
              select:{
                favorites:true,
              }
            },
          }
        }
      }
    });

    res.json({
      ok: true,
      favs,
    });
  }

}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: true,
  })
);