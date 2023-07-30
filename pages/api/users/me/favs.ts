import { NextApiRequest, NextApiResponse } from "next";
import products from "pages/api/products";
import withHandler from "pages/libs/server/withHandler";
import { withApiSession } from "pages/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "GET") {
    const {
      session: { user },
    } = req;

    const favorites = await client.favorite.findMany({
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
      favorites,
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