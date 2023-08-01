import { NextApiRequest, NextApiResponse } from "next";
import products from "pages/api/products";
import withHandler from "libs/server/withHandler";
import { withApiSession } from "libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "GET") {
    const {
      session: { user },
    } = req;

    const sell = await client.sold.findMany({
      where:{
        userId:user.id+"",
        AND:{
          saleIs:{
            equals:false,
          }
        },
      },
      select:{
        product:{
         include:{
          _count:{
            select:{
              favorites:true,
              room:true,
            }
          },
          sold:true,
         }
        }
      }
    });
    res.json({
      ok: true,
      sell,
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
