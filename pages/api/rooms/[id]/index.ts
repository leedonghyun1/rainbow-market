import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "libs/server/withHandler";
import { withApiSession } from "libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
    body
  } = req;

  if (req.method == "POST") {

    const payload = Math.floor(1000000 + Math.random() * 90000000) + "";
    
    const room = await client.room.create({
      data: {
        name: payload,
        productOwnerId : body,
        product: {
          connect: {
            id: id + "",
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });


    res.json({
      ok: true,
      room,
    });
  }
  
  if (req.method === "GET") {
    const room = await client.room.findFirst({
      where: {
        OR: [
          {
            productId: id + "",
            userId:user.id,
          },
          {
            productId: id + "",
            productOwnerId:user.id,
          }
        ],
      },
      include: {
        message: {
          select: {
            id: true,
            message: true,
            readOrNot:true,
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


    res.json({
      ok: true,
      room,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST","GET"],
    handler,
    isPrivate: true,
  })
);
