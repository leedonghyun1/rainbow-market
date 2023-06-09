import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponsType } from "pages/libs/server/withHandler";
import { withIronSessionApiRoute } from "iron-session/next";
import client from "pages/libs/server/client";
import { withApiSession } from "pages/libs/server/withSession";


async function handler(req: NextApiRequest, res: NextApiResponse<ResponsType>) {
  const {
    query: { id },
    session: {user},
  } = req;
  if(req.method=="GET"){
    const stream = await client.stream.findUnique({
      where: {
        id: +id.toString(),
      },
      include: {
        message: {
          select: {
            id: true,
            message: true,
            user: {
              select: {
                avatar: true,
                id: true,
              },
            },
          },
        },
      },
    });
    const isOwner = stream?.userId === user?.id;
    if (stream && !isOwner) {
      stream.cloudflareKey = "abnormal access";
      stream.cloudflareUrl = "abnormal access";
    }

    res.json({
      ok: true,
      stream,
    });
  }
}
export default withApiSession(withHandler({
  methods: ["GET"],
  handler,
  isPrivate:true,
}));
