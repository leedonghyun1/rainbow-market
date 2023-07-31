import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "libs/server/withHandler";
import { withApiSession } from "libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "GET") {
    const {
      session: { user },
    } = req;
    const profile = await client.user.findUnique({
      where: {
        id: user?.id,
      },
    });
    res.json({
      ok: true,
      profile,
    });
  }
  if(req.method === "POST") {
    const {
      session: { user },
      body: { imageId, name, phone },
    } = req;
    const currentUser = await client.user.findUnique({
      where:{
        id: user?.id
      }
    })
    if( phone && phone === currentUser?.phone){
      return res.json({
        ok:false,
        error:"동일한 휴대전화 번호입니다."
      })
    }
    if( phone && phone !== currentUser?.phone){
      const alreadyExist = Boolean(
        await client.user.findUnique({
          where: {
            phone,
          },
          select: {
            id: true,
          },
        })
      );
      if(alreadyExist){
        return res.json({
          ok:false,
          error:"동일한 휴대전화 번호가 존재합니다."
        })
      }
      await client.user.update({
        where:{
          id: user?.id
        },
        data:{
          phone,
        }
      });
      res.json({ ok: true });
    }
    if( imageId ){
      await client.user.update({
        where:{
          id:user?.id
        },
        data:{
          image: imageId,
        }
      });
      res.json({ ok: true });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
    isPrivate: true,
  })
);
