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
      messageInput,
      checkRoom: { room },
    },
    session: { user },
  } = req;

    const message = await client.message.create({
      data: {
        message : messageInput.messageInput+"",
        product: {
          connect: {
            id:id+"",
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
        room:{
          connect:{
            id: room.id,
          }
        }
      },
    });

    res.json({
      ok: true,
      message,
    });
  }
export default withApiSession(withHandler({
  methods: ["POST"],
  handler,
  isPrivate:true,
}));
