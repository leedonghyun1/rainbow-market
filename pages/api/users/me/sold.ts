import { NextApiRequest, NextApiResponse } from "next";
import products from "pages/api/products";
import withHandler from "libs/server/withHandler";
import { withApiSession } from "libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "GET") {
    const {
      session: { user },
    } = req;

    const sold = await client.sold.findMany({
      where:{
        userId:user.id+"",
        AND:{
          saleIs:{
            equals:true,
          }
        },
      },
      select:{
        product:{
         include:{
          _count:{
            select:{
              favorites:true,
            }
          },
          sold:true,
         }
        }
      }
    });
    res.json({
      ok: true,
      sold,
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
