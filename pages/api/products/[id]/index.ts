import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponsType } from "pages/libs/server/withHandler";
import { withIronSessionApiRoute } from "iron-session/next";
import client from "pages/libs/server/client";
import { withApiSession } from "pages/libs/server/withSession";


async function handler(req: NextApiRequest, res: NextApiResponse<ResponsType>) {
  
  const { query:{id}, session:{user} } = req;
  const product = await client.product.findUnique({
    where:{
      id: +id,
    },
    include:{
      user:{
        select:{
          id:true,
          name:true,
          avatar:true,
        }
      }
    }
  });

  const terms = product?.name.split(" ").map((productName) => ({
    name: {
      contains: productName,
    },
  }));

  const relatedProducts = await client.product.findMany({
    where: {
      OR : terms,
      AND:{
        id:{
          not: product?.id,
        }
      }
    }
  })

  const isLiked = Boolean(
    await client.favorite.findFirst({
      where: {
        productId: product.id,
        userId: user.id,
      },
      select: {
        id: true,
      },
    })
  );

  res.json({
    ok: true,
    product,
    isLiked,
    relatedProducts,
  });
}
export default withApiSession(withHandler({
  methods: ["GET"],
  handler,
  isPrivate:true,
}));
