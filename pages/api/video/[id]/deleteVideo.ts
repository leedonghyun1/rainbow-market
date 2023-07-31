import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "libs/server/withHandler";
import { withApiSession } from "libs/server/withSession";
import { env } from "process";

async function handler(req:NextApiRequest, res:NextApiResponse) {
  const {
    query: { id },
  } = req;

  const product = await client.product.findUnique({
    where: {
      id: id + "",
    },
  });

  const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN_VIDEO } = env;
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/${product.uploadVideo}`;
  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CLOUDFLARE_API_TOKEN_VIDEO}`,
    },
  });
  res.json({
    ok:true,
    ...response
  });
}
export default withApiSession(
  withHandler({
    methods: ["DELETE","GET"],
    handler,
    isPrivate:true,
  })
); 