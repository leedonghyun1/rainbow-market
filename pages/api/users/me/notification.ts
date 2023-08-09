import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "libs/server/withHandler";
import { withApiSession } from "libs/server/withSession";

export function count({rooms}){


}

async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "GET") {
    const {
      session: { user },
    } = req;

    const rooms = await client.room.findMany({
      where: {
        productOwnerId: user?.id + "",
      },
      include: {
        message:{
          select:{
            id:true,
            readOrNot:true,
            user:{
              select:{
                id:true,
              }
            }
          }
        }
      }
    });

    let unreadMsgCount=0;

    rooms?.map((room)=>{
      room.message?.map((message)=>{
        if(message.user?.id !== user?.id && message.readOrNot === false){
          unreadMsgCount += 1;
        }
      })
    })

    const updateNotifications = await client.user.update({
      where: {
        id: user?.id,
      },
      data: {
        notifications: +unreadMsgCount,
      },
    });

    res.json({
      ok: true,
      unreadMsgCount,
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
