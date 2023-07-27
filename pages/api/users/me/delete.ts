import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "pages/libs/server/withHandler";
import { withApiSession } from "pages/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  if(req.method === "POST") {
    const {
      session: { user },
    } = req;
    const currentUser = await client.user.findUnique({
      where:{
        id: user?.id
      }
    })
    console.log(user, currentUser)
  }
  res.end()
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: true,
  })
);
