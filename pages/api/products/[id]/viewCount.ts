import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "libs/server/withHandler";
import { withApiSession } from "libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;

  if (req.method === "POST"){
    
    const count = await client.product.findUnique({
      where:{
        id:id+"",
      },
      select:{
        viewCount:true,
      }
    })
 
    const updateViewCount = await client.product.update({
      where:{
        id: id+"",
      },
      data:{
        viewCount: count.viewCount+1,
      }
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
