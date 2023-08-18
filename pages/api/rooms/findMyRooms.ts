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

    let unreadMsgCount=0;

    rooms.map((room)=>{
      room.user.messages.map(async(message)=>{
        if(message.readOrNot===false){
          unreadMsgCount += 1;
          await client.room.update({
            where: {
              id: room?.id,
            },
            data: {
              unreadMsgs: unreadMsgCount,
            },
          });
        }
      })
    })

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
