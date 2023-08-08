import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponsType } from "libs/server/withHandler";
import { withIronSessionApiRoute } from "iron-session/next";
import client from "libs/server/client";
import { withApiSession } from "libs/server/withSession";
import { waitForDebugger } from "node:inspector";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponsType>) {
  const {
    query: { id },
    body: {
      message,
      checkRoomAndMsg: { room },
    },
    session: { user },
  } = req;

  const messages = await client.message.create({
    data: {
      message: message.message + "",
      readOrNot: false,
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
      room: {
        connect: {
          id: room?.id,
        },
      },
    },
  });

  const updateMessage = await client.room.update({
    where: {
      id: messages?.roomId,
    },
    data: {
      lastChat: messages?.message,
      timeOfLastChat: new Date(),
    },
  });

  res.json({
    ok: true,
    messages,
  });
}
export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: true,
  })
);
