import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "libs/server/withHandler";
import { withApiSession } from "libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;

  if (req.method === "POST"){
    
    const productViewCount = await client.product.findUnique({
      where:{
        id:id+"",
      },
      select:{
        userId:true,
        viewCount:true,
      }
    })

    if(productViewCount.userId !== user?.id){
      const updateViewCount = await client.product.update({
        where:{
          id: id+"",
        },
        data:{
          viewCount: productViewCount.viewCount+1,
        }
      })
    }

    res.json({
      ok:true,
    })
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: true,
  })
);
