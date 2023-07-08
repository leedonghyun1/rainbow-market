import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "pages/libs/server/withHandler";
import { withApiSession } from "pages/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method == "POST"){
    const {
      body: { name, price, description, link, videoId},
      session: { user },
    } = req;
    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        link,
        uploadVideo : videoId,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    res.json({
      ok:true,
      product,
    })
  }
  if(req.method == "GET"){
    const products = await client.product.findMany({
      include:{
        _count:{
          select:{
            favorites:true,
          }
        },
      },
    })
    res.json({
      ok:true,
      products,
    })
  }
}

export default withApiSession(withHandler({
  methods:["POST","GET"],
  handler,
  isPrivate:true,
}))