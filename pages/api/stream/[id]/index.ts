import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponsType } from "libs/server/withHandler";
import { withIronSessionApiRoute } from "iron-session/next";
import client from "libs/server/client";
import { withApiSession } from "libs/server/withSession";


async function handler(req: NextApiRequest, res: NextApiResponse<ResponsType>) {
  const {
    query: { id },
    session: {user},
  } = req;
  if(req.method==="GET"){
    const stream = await client.stream.findUnique({
      where: {
        id: id+"",
      },
      include: {
        message: {
          select: {
            id: true,
            message: true,
            user: {
              select: {
                image: true,
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

    console.log(stream);

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
