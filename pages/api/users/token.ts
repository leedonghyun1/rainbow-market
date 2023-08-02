import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "libs/server/withHandler";
import { withApiSession } from "libs/server/withSession";
import { empty } from "@prisma/client/runtime";


async function handler(req:NextApiRequest, res:NextApiResponse){
  const {
    body: {
      user: { name, email, image },
    },
  } = req;

  if(!email) return res.status(400).json({ok:false});
  
  const tokenCheck = await client.user.findUnique({
    where: {
      email,
    },
    select:{
      tokens:{
        select:{
          id:true,
        }
      }
    }
  });

  if (tokenCheck.tokens.length !== 0  && req.body.user) {
    return res.status(200).json({ ok: true });
  } 

  const payload = Math.floor(10000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connect: {
          email,
        },
      },
    },
  });

  const foundToken = await client.token.findUnique({
    where:{
      payload,
    },
    include:{
      user:true,
    }
  })
  if(!foundToken) return res.status(404).json({ok:false});

  req.session.user = {
    id: foundToken?.userId
  }
  await req.session.save();

  return res.json({
    ok: true,
    token,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: false,
  })
); 