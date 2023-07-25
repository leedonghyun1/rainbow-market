import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "pages/libs/server/withHandler";
import { withApiSession } from "pages/libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;

  if (req.method == "GET") {
    const product = await client.product.findUnique({
      where: {
        id: id + "",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        message:{
          select:{
            id:true,
            message:true,
            user:{
              select:{
                image:true,
                id:true,
              }
            }
          }
        }
      },
    });
    // 유사상품 sorting 조건
    const terms = product?.name.split(" ").map((productName) => ({
      name: {
        contains: productName,
      }
    }));

    const relatedProducts = await client.product.findMany({
      where:{
        OR: terms,
        AND:{
          id:{
            not:product?.id
          },
        },
      },
    })
    const isLiked = Boolean(
      await client.favorite.findFirst({
        where:{
          productId: product.id,
          userId: user.id,
        },
        select:{
          id:true,
        }
      })
    )
    res.json({
      ok: true,
      product,
      isLiked,
      relatedProducts,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: true,
  })
);
