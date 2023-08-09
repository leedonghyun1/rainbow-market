import withHandler, { ResponsType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponsType>) {
  const {
    query: { id },
    body: {
      checkRoomAndMsg:{ room },
    },
    session: { user },
  } = req;

  const findMessage = await client.message.findMany({
    where: {
      OR: [{ userId: room.userId }, { userId: room.productOwnerId }],
    },
    select: {
      id: true,
      userId:true,
    },
  });


  findMessage.map(async (message) => {
    if(message.userId!==user.id){
      const updateMessage = await client.message.update({
        where: {
          id: message.id,
        },
        data: {
          readOrNot: true,
        },
      });
    }
  });

  res.json({
    ok: true,  
  });
}
export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: true,
  })
);
