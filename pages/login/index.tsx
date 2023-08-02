import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";

import { useRouter } from "next/router";

interface loginMutation {
  ok: Boolean;
}

const Login: NextPage = () => {
   //세션 및 라우팅 관리
   const { data: session } = useSession();
   const router = useRouter();
   if(session){
     router.replace("/");
   }

  return (
    <div className="mt-16 px-4 h-full flex flex-col gap-y-32">
      <h3 className="text-5xl font-bold text-center text-white bg-purple-400 p-5 rounded-xl shadow-md">
        Rainbow Super
      </h3>
      <h5 className="text-2xl font-semibold text-center text-purple-300">
        Anyone, anything you want to sell.
      </h5>
      <div>
        <div className="flex flex-row justify-center gap-10">
          {!session && 
          <>
            <button onClick={() => signIn("kakao")}>
              <img
                src="/images/btn/kakao.png"
                alt="kakao-login"
                className="h-12 w-auto rounded-full"
              />
            </button>
            <button onClick={() => signIn("naver")}>
              <img
                src="/images/btn/naver.png"
                alt="naver-login"
                className="h-12 w-auto rounded-full"
              />
            </button>
            <button onClick={() => signIn("google")}>
              <img
                src="/images/btn/google.png"
                alt="google-login"
                className="h-14 w-auto"
              />
            </button>
          </>

         } 
        </div>
      </div>
    </div>
  );
};

export default Login;
