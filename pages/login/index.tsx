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
    <div className="mt-16 px-4">
      <h3 className="text-5xl font-bold text-center text-purple-500">
        Rainbow Supermarket
      </h3>
      <div className="mt-12">
        <div
          className="flex flex-col items-center justify-center gap-10"
        >
          {!session && (
            <>
              <button onClick={() => signIn("kakao")}>
                <img
                  src="/images/kakao_login_large_narrow.png"
                  alt="kakao-login"
                  className="h-12 w-auto"
                />
              </button>
              <button onClick={() => signIn("naver")}>
                <img
                  src="/images/naver_login_large_narrow.png"
                  alt="naver-login"
                  className="h-12 w-auto"
                />
              </button>
              <button onClick={() => signIn("google")}>
                <img
                  src="/images/google_login_large_narrow.png"
                  alt="naver-login"
                  className="h-12 w-auto"
                />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
