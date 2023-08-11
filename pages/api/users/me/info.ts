import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "libs/server/withHandler";
import { withApiSession } from "libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
  } = req;

  if (req.method === "GET") {
    const userInfo = await client.user.findUnique({
      where: {
        id: user?.id + "",
      },
      include: {
        favorites:{
          select:{
            id:true,
          }
        },
        sold:{
          select:{
            id:true,
            saleIs:true,
          }
        },
        stream:{
          select:{
            id:true,
          }
        }
      },
    });

    let completedSold=0;
    const count = userInfo?.sold?.map((sold)=>{
      if(sold.saleIs===true){
        completedSold += 1;
      }
    })
    const favorites = +userInfo.favorites?.length;
    const sold = +userInfo.sold?.length;
    const stream = +userInfo.stream?.length;
    const countSum = favorites+sold+stream+completedSold;
    
    if(userInfo){

      const starUpdate = await client.user.update({
        where:{
          id:user?.id,
        },
        data:{
          star:countSum,
        }
      })
    }
    res.json({
      ok: true,
      favorites,
      sold,
      completedSold,
      stream,
      countSum,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST","GET"],
    handler,
    isPrivate: true,
  })
);
