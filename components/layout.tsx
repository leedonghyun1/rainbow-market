import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import Script from "next/script";
import cls from "libs/client/utils";

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
        <title>{`${seoTitle} | 무지개 슈퍼마켓`}</title>
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
            className="absolute mr-3 text-xs right-1 bg-slate-200 p-1 rounded-lg hover:bg-red-400 hover:text-white hover:font-bold"
          >
            Log Out
          </button>
        )}
        {!session && (
          <button
            onClick={() => router.replace("/login")}
            className="absolute mr-3 text-xs right-1 bg-slate-200 p-1 rounded-lg hover:bg-purple-400 hover:text-white hover:font-bold"
          >
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
              router.pathname === "/"
                ? "text-purple-600 font-semibold"
                : "hover:text-gray-900 transition-colors"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>

            <span>홈</span>
          </Link>
          <Link
            href="/products/upload"
            className={cls(
              "flex flex-col items-center space-y-2",
              router.pathname === "/products/upload"
                ? "text-purple-600  font-semibold"
                : "hover:text-gray-900 transition-colors"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
            </svg>
            <span>슈퍼등록</span>
          </Link>
          <Link
            href="/stream"
            className={cls(
              "flex flex-col items-center space-y-2",
              router.pathname === "/stream"
                ? "text-purple-600 font-semibold"
                : "hover:text-gray-900 transition-colors"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <span>라이브</span>
          </Link>
          <Link
            href="/profile/edit"
            className={cls(
              "flex flex-col items-center space-y-2",
              router.pathname === "/profile/edit"
                ? "text-purple-600 font-semibold"
                : "hover:text-gray-900 transition-colors"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>나의슈퍼</span>
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
