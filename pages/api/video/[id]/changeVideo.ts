import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "pages/libs/server/withHandler";
import { withApiSession } from "pages/libs/server/withSession";
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
  const createrId = { "creator": `${product.id}`}
  const data = {createrId};
  const response = await( await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CLOUDFLARE_API_TOKEN_VIDEO}`,
    },
    body: JSON.stringify(data),
  })).json();

  res.json({
    ok:true,
    ...response.result
  });
}
export default withApiSession(
  withHandler({
    methods: ["POST","GET"],
    handler,
    isPrivate:true,
  })
); 