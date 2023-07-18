import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import Script from "next/script";
import cls from "pages/libs/client/utils";

export interface LayoutProps {
  seoTitle: string;
  canGoBack?: boolean;
  children: React.ReactNode;
  hasTabBar?: boolean;
  title?: string;
}

export default function Layout({
  seoTitle,
  canGoBack,
  children,
  hasTabBar,
  title,
}: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data:session } = useSession();
  const onClick = () => {
    router.back();
  };
  return (
    <div>
      <Head>
        <title> {seoTitle} | 무지개 슈퍼마켓</title>
      </Head>
      <div className="text-gray-700 bg-white text-xl w-full max-auto h-12 max-w-2xl flex items-center justify-center font-bold fixed top-0 border-b">
        {canGoBack ? (
          <button className="absolute left-4" onClick={onClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 448 512"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
          </button>
        ) : null}
        {title ? (
          <span className={cls(canGoBack ? "mx-auto" : "", "")}>{title}</span>
        ) : null}
        {session && (
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mr-3 text-sm"
          >
            Log Out
          </button>
        )}
        {!session && (
          <button onClick={() => router.replace("/login")} className="text-sm">
            Log In
          </button>
        )}
      </div>
      <div className={cls("pt-5", hasTabBar ? "pb-24" : "")}>{children}</div>
      {hasTabBar ? (
        <nav className="bg-white max-auto max-w-2xl text-gray-700 border-t fixed bottom-0 w-full px-10 pb-5 pt-3 flex justify-between text-sm">
          <Link
            href="/"
            className={cls(
              "flex flex-col items-center space-y-2",
              pathname?.startsWith("/")
                ? "text-purple-600 font-semibold"
                : "hover:text-gray-900 transition-colors"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 576 512"
            >
              <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
            </svg>
            <span>홈</span>
          </Link>
          <Link
            href="/products/upload"
            className={cls(
              "flex flex-col items-center space-y-2",
              pathname?.startsWith("/products/upload")
                ? "text-purple-600  font-semibold"
                : "hover:text-gray-900 transition-colors"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
            >
              <path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
            </svg>
            <span>슈퍼등록</span>
          </Link>
          <Link
            href="/chat"
            className={cls(
              "flex flex-col items-center space-y-2",
              pathname?.startsWith("/chat")
                ? "text-purple-600 font-semibold"
                : "hover:text-gray-900 transition-colors"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
            >
              <path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" />
            </svg>
            <span>채팅내역</span>
          </Link>
          <Link
            href="/profile/edit"
            className={cls(
              "flex flex-col items-center space-y-2",
              pathname?.startsWith("/profile/edit")
                ? "text-purple-600 font-semibold"
                : "hover:text-gray-900 transition-colors"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 448 512"
            >
              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
            </svg>
            <span>나의슈퍼</span>
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
