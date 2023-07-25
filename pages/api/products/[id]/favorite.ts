import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponsType } from "pages/libs/server/withHandler";
import client from "pages/libs/server/client";
import { withApiSession } from "pages/libs/server/withSession";


async function handler(req: NextApiRequest, res: NextApiResponse<ResponsType>) {
  
  const {
    query: { id },
    session: { user },
  } = req;

  const alreadyExists = await client.favorite.findFirst({
    where:{
      productId: id+"",
      userId: user?.id,
    }
  })

  if(alreadyExists){
    await client.favorite.delete({
      where:{
        id: alreadyExists.id,
      }
    })
  } else {
    await client.favorite.create({
      data : {
        user :{
          connect:{
            id: user?.id,
          }
        },
        product :{
          connect :{
            id: id+"",
          }
        }
      }
    })
  }
  res.json({
    ok: true,
  });
}
export default withApiSession(withHandler({
  methods: ["POST"],
  handler,
  isPrivate:true,
}));
