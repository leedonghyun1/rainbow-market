import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponsType } from "pages/libs/server/withHandler";
import { withIronSessionApiRoute } from "iron-session/next";
import client from "pages/libs/server/client";
import { withApiSession } from "pages/libs/server/withSession";


async function handler(req: NextApiRequest, res: NextApiResponse<ResponsType>) {
  if(req.method=="POST"){
    const {
      body: { name, price, description, photoId },
      session: { user },
    } = req;
    const product = await client.product.create({
      data:{
        name,
        price: +price,
        description,
        image: photoId,
        user:{
          connect:{
            id: user?.id
          }
        }
      }
    })
    res.json({
      ok: true,
      product,
    });
  }
  if(req.method=="GET"){
    const products = await client.product.findMany({
      include:{
        _count:{
          select: {
            favorite :true,
          }
        }
      }
    })
    res.json({
      ok:true,
      products,
    })
  }
}
export default withApiSession(withHandler({
  methods: ["GET","POST"],
  handler,
  isPrivate:true,
}));
