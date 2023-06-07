import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponsType } from "pages/libs/server/withHandler";
import { withIronSessionApiRoute } from "iron-session/next";
import client from "pages/libs/server/client";
import { withApiSession } from "pages/libs/server/withSession";


async function handler(req: NextApiRequest, res: NextApiResponse<ResponsType>) {
  const {
    query: { id },
    session: { user },
    body : { answer }
  } = req;

  const newAnswer = await client.answer.create({
    data: {
      user:{
        connect:{
          id: user.id
        }
      },
      post:{
        connect:{
          id: +id
        }
      },
      answer,
    }
  })

  res.json({
    ok: true,
    answer: newAnswer,
  });
}

export default withApiSession(withHandler({
  methods: ["POST"],
  handler,
  isPrivate:true,
}));
