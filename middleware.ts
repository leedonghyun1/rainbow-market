import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"
import { NextFetchEvent } from "next/server"

const secret = process.env.NEXTAUTH_SECRET

export default async function sessionHandler(req:NextApiRequest, res:NextApiResponse, event: NextFetchEvent) {
  const token = await getToken({ req, secret, raw:true })
  console.log("JSON Web Token", token);
}

export const config = {
  matcher:["/"]
}