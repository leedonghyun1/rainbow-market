import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "libs/server/withHandler";
import { withApiSession } from "libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === "POST"){
    const {
      body: { name, price, description, link, videoId},
      session: { user },
      query:{ id },
    } = req;
    const product = await client.product.update({
      where:{
        id : id+"",
      },
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
 
}

export default withApiSession(withHandler({
  methods:["POST"],
  handler,
  isPrivate:true,
}))