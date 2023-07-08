import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "pages/libs/server/withHandler";
import { withApiSession } from "pages/libs/server/withSession";
import { env } from "process";

async function handler(req:NextApiRequest, res:NextApiResponse) {
  const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN_AVATAR } = env;
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1/direct_upload`;
  const response = await(
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN_AVATAR}`,
      },
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