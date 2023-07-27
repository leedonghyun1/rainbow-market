import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "pages/libs/server/withHandler";
import { withApiSession } from "pages/libs/server/withSession";
import { env } from "process";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
  } = req;

  //double check
  const currentUser = await client.user.findUnique({
    where: {
      id: user?.id,
    },
  });

  const deleteUser = await client.user.delete({
    where: {
      id: currentUser?.id,
    },
  });

  const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN_AVATAR } = env;
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1/${currentUser?.image}`;
  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CLOUDFLARE_API_TOKEN_AVATAR}`,
    },
  });
  req.session.destroy();
  
  res.json({
    ok: true,
    ...response,
  });
}

export default withApiSession(
  withHandler({
    methods: ["DELETE", "GET"],
    handler,
    isPrivate: true,
  })
);
