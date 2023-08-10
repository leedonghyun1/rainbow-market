import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "libs/server/withHandler";
import { withApiSession } from "libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
    body,
  } = req;

  if (req.method === "GET") {
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
            star:true,
          },
        },
        favorites:{
          select:{
            id:true,
          }
        },
      },
    });

    const userSoldInfo = await client.user.findMany({
      where:{
        id: product?.userId
      },
      select:{
        sold:{
          select:{
            saleIs:true,
          }
        }
      }
    });

    let soldCompletedCount = 0;

    const count = userSoldInfo.map((info)=>{
      info.sold.map((info)=>{
        if(info.saleIs === true){
          soldCompletedCount += 1;
        }
      })
    });

    const userStreamCount = await client.stream.findMany({
      where:{
        userId: product?.userId,
      },
      select:{
        id:true,
      }
    })
    
    res.json({
      ok: true,
      product,
      userSoldInfo,
      soldCompletedCount,
      userStreamCount,
    });
  }

  if( req.method === "POST"){
    console.log(body);
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST","GET"],
    handler,
    isPrivate: true,
  })
);
