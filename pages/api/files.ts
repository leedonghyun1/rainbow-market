//이 handler의 역할은 빈 cloudflare url을 받아서 유저에게 주는 역할만함.
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponsType } from "pages/libs/server/withHandler";
import { withApiSession } from "pages/libs/server/withSession";


async function handler(req: NextApiRequest, res: NextApiResponse<ResponsType>) {

  const response = await(
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNTID}/images/v2/direct_upload`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CF_IMAGETOKEN}`,
        },
      }
    )
  ).json();

  res.json({
    ok: true,
    ...response.result
  });
}
export default withApiSession(withHandler({
  methods:["GET"],
  handler,
  isPrivate:true,
}));
