import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "types/chat";



async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  const {
    body :{message},
    query: { id },
    session: { user },
  } = req;
  if (req.method === "POST") {

    res?.socket?.server?.io?.emit("message", message);

    const streamMessages = await client.streamMessage.create({
      data: {
        message: message,
        stream: {
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
      ok:true,
    })
  }
};

export default withApiSession(
  withHandler({
    methods: ["POST","GET"],
    handler,
    isPrivate: true,
  })
);
