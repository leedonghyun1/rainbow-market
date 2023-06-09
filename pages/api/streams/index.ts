import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponsType } from "pages/libs/server/withHandler";
import { withIronSessionApiRoute } from "iron-session/next";
import client from "pages/libs/server/client";
import { withApiSession } from "pages/libs/server/withSession";


async function handler(req: NextApiRequest, res: NextApiResponse<ResponsType>) {
  const {
    body: { name, price, description },
    session: { user },
  } = req;

  if(req.method=="POST"){
   const {
     result: {
       uid,
       rtmps: { url, streamKey },
     },
   } = await(
     await fetch(
       `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNTID}/stream/live_inputs`,
       {
         method: "POST",
         headers: {
           Authorization: `Bearer ${process.env.CF_STREAMTOKEN}`,
         },
         body: `{"meta": {"name":"${name}"},"recording": { "mode": "automatic" }}`,
       }
     )
   ).json();

    const stream = await client.stream.create({
      data: {
        name,
        price,
        description,
        cloudflareId: uid,
        cloudflareKey: streamKey,
        cloudflareUrl: url,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      stream,
    });
  } else if(req.method=="GET"){
    const {
      query: { id },
    } = req;
    const stream = await client.stream.findMany({
      take:10,
    });
    res.json({
      ok:true,
      stream,
    })
  }
}
export default withApiSession(withHandler({
  methods: ["GET","POST"],
  handler,
  isPrivate:true,
}));
