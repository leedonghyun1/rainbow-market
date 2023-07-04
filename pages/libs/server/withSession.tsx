import { withIronSessionApiRoute } from "iron-session/next"

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: string;
    };
  }
}
const cookieOptions = {
  cookieName: "rainbowmarket",
  password: process.env.COOKIE_PASSWORD,
};

export function withApiSession(fn:any){
  return withIronSessionApiRoute(fn, cookieOptions);
}