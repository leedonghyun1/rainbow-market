import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "libs/server/withHandler";
import { withApiSession } from "libs/server/withSession";
import { sendFCMNotification } from "./fcmNotis";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
    body :{message, userid},
  } = req;

  if (req.method === "POST") {
    const userInfo = await client.user.findUnique({
      where:{
        id: userid
      },
      select:{
        name:true,
        fcmToken:true
      }
    });

    sendFCMNotification(userInfo.name, message.message, userInfo.fcmToken)

    res.json({
      ok: true,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: true,
  })
);
