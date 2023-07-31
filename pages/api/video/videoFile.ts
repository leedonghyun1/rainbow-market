import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "libs/server/withHandler";
import { withApiSession } from "libs/server/withSession";
import { env } from "process";

async function handler(req:NextApiRequest, res:NextApiResponse) {
  const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN_VIDEO } = env;
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/direct_upload`;
  const maxDurationSeconds = 21600;
  const data = { maxDurationSeconds};
  const response = await(
    await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN_VIDEO}`,
      },
      body: JSON.stringify(data),
    })
  ).json();
  //backend request id 는 empty url을 받기 위한 id

  res.json({
    ok:true,
    ...response.result,
  });
}
export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate:true,
  })
); 