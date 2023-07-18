import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "pages/libs/server/withHandler";
import { withApiSession } from "pages/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "GET") {
    const {
      session: { user },
    } = req;
    const rooms = await client.room.findMany({
      where: {
        userId: user.id + "",
      },
      include: {
        user: {
          select: {
            image: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.json({
      ok: true,
      rooms,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: true,
  })
);
