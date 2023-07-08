import { Session } from "inspector";
import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import { useRouter } from "next/router";
import useMutation from "pages/libs/client/useMutation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface loginMutation {
  ok: Boolean;
}

const Login: NextPage = () => {
  //세션 및 라우팅 관리
  const { data: session } = useSession();
  const router = useRouter();

  //useMutation
  const [login, { loading, data, error }] =
    useMutation<loginMutation>("/api/users/token");

  useEffect(()=>{
    if (session) {
      login(session.user.email);
      router.replace("/");
    }
  },[router, session]);

  return (
    <div className="mt-16 px-4">
      <h3 className="text-5xl font-bold text-center text-purple-500">
        Rainbow Super
      </h3>
      <div className="mt-12">
        <div
          className="flex flex-col items-center justify-center gap-10"
        >
          {!session && (
            <>
              <button onClick={() => signIn("kakao", { callbackUrl: "/" })}>
                <img
                  src="/images/kakao_login_large_narrow.png"
                  alt="kakao-login"
                  className="h-12 w-auto"
                />
              </button>
              <button onClick={() => signIn("naver", { callbackUrl: "/" })}>
                <img
                  src="/images/naver_login_large_narrow.png"
                  alt="naver-login"
                  className="h-12 w-auto"
                />
              </button>
              <button onClick={() => signIn("google", { callbackUrl: "/" })}>
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
