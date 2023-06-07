import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponsType } from "pages/libs/server/withHandler";
import { withIronSessionApiRoute } from "iron-session/next";
import client from "pages/libs/server/client";
import { withApiSession } from "pages/libs/server/withSession";


async function handler(req: NextApiRequest, res: NextApiResponse<ResponsType>) {
  const {
    query: { id },
    session: { user },
  } = req;

const post = await client.post.findUnique({
  where: {
    id: +id.toString(),
  },
  include:{
    user: {
      select:{
        id:true,
        name:true,
        avatar:true,
      }
    },
    answer:{
      select:{
        answer:true,
        id:true,
        user:{
          select:{
            id:true,
            name:true,
            avatar:true,
          }
        }
      }
    },
    _count:{
      select:{
        answer:true,
        wondering:true,
      }
    }
  }
}); 

const isWondering = Boolean(
  await client.wondering.findFirst({
    where: {
      postId: +id.toString(),
      userId: user?.id,
    },
    select: {
      id: true,
    },
  })
);

  res.json({
    ok: true,
    post,
    isWondering,
  });
}
export default withApiSession(withHandler({
  methods: ["GET"],
  handler,
  isPrivate:true,
}));
