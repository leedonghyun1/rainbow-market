import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import client from "pages/libs/server/client";
import smtpTransport from "pages/libs/server/email";
import withHandler, { ResponsType } from "pages/libs/server/withHandler";
import twilio from "twilio";
import { withApiSession } from "pages/libs/server/withSession";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(req: NextApiRequest, res: NextApiResponse<ResponsType>) {
  const { token } = req.body;
  const foundToken = await client.token.findUnique({
    where: {
      payload: token,
    },
    include: {
      user: true,
    }
  });
  if(!foundToken) return res.status(404).end();
  req.session.user = {
    id: foundToken?.userId
  }
  await req.session.save();
  await client.token.deleteMany({
    where:{
      userId: foundToken.userId,
    },
  })
  res.json({
    ok:true
  })
}
export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: false,
  })
); 
