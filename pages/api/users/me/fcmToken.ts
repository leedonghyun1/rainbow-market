import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "libs/server/withHandler";
import { withApiSession } from "libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  if(req.method === "POST") {
    const {
      session: { user },
      body:{ currentToken },
    } = req;
    const currentUser = await client.user.update({
      where:{
        id:user?.id
      },
      data:{
        fcmToken:currentToken,
      }
    })

    res.json({
      ok:true,
    })
  }
  if(req.method==="GET"){
    const {
      session: { user },
    } = req;

    const fcmToken = await client.user.findUnique({
      where:{
        id:user?.id
      },
      select:{
        fcmToken:true,
      }
    })

    res.json({
      ok:true,
      fcmToken,
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
