import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponsType } from "libs/server/withHandler";
import { withIronSessionApiRoute } from "iron-session/next";
import client from "libs/server/client";
import { withApiSession } from "libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponsType>) {
  const {
    body: { name, price, description, link },
    session: { user },
  } = req;

  if (req.method == "POST") {
    const {
      result: {
        uid,
        rtmps: { url, streamKey },
      },
    } = await (
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN_LIVE}`,
          },
          body: `{"meta": {"name":"${name}"},"recording": { "mode": "automatic","timeoutSeconds":10 }}`,
        } 
      )
    ).json();

    const stream = await client.stream.create({
      data: {
        name,
        price,
        description,
        link,
        cloudflareId: uid,
        cloudflareKey: streamKey,
        cloudflareUrl: url,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      stream,
    });
  } else if (req.method == "GET") {
    const {
      query: { id },
    } = req;
    const stream = await client.stream.findMany({
      take: 10,
      include:{
        user:{
         select:{
          image:true
         }
        }
      }
    });
    res.json({
      ok: true,
      stream,
    });
  }
}
export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
    isPrivate: false,
  })
);
