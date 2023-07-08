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
    const terms = product?.name.split(" ").map((productName) => {
      name: {
        contains: productName;
      }
    });
    res.json({
      ok: true,
      product,
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
