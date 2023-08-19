import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "libs/server/withHandler";
import { withApiSession } from "libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "GET") {
    const {
      session: { user },
    } = req;
    const rooms = await client.room.findMany({
      where: {
        productOwnerId: user?.id + "",
      },
      include: {
        user: {
          select: {
            id: true,
            image: true,
            name: true,
            email: true,
            messages: {
              select: {
                id: true,
                readOrNot: true,
              },
            },
          },
        },
        product: {
          select: {
            name: true,
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
