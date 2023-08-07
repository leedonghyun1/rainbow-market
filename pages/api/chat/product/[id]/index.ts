import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "libs/server/withHandler";
import { withApiSession } from "libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;

  if (req.method === "GET") {
    const product = await client.product.findFirst({
      where: {
        id: id + "",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            id:true,
          },
        },
        room: {
          include: {
            message: {
              select: {
                id: true,
                message: true,
                user: {
                  select: {
                    image: true,
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    await res.revalidate(`/chat/product/${id}`);

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
