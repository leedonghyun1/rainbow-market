import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import client from "pages/libs/server/client";
import withHandler, { ResponsType } from "pages/libs/server/withHandler";
import { withApiSession } from "pages/libs/server/withSession";
import twilio from "twilio";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(req: NextApiRequest, res: NextApiResponse<ResponsType>) {
  const { phone, email } = req.body;
  const user = phone ? { phone } : email ? { email } : null;

  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(10000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
            phone,
          },
        },
      },
    },
  });

  if (phone) {
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   to: process.env.PHONE_NUMBER,
    //   body: `Your Login Token is ${payload}`,
    // });
  }

  if (email) {
    // const mailOptions = {
    //   from: process.env.MAIL_ID,
    //   to: "",
    //   suject:"Authentication Email",
    //   text:`Auth Code is ${payload}`
    // };
    // const result = await smtpTransport.sendMail( mailOptions, (error, response)=>{
    //   if(error){
    //     console.log(`smtp sending error : ${error}`)
    //   } else {
    //     console.log(`smtp sending response : ${response}`)
    //     return null;
    //   }
    // })
    // smtpTransport.close();
    // console.log(`smtp sending result : ${result}`);
  }

  return res.json({
    ok: true,
  });
}
export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: false,
  })
); 

