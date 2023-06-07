import type { NextPage } from "next";
import React from "react";
import Layout from "../components/layout";
import Link from "next/link";
import FloatingButton from "pages/components/floating-button";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Stream } from "@prisma/client";

interface StreamResponse {
  ok:boolean;
  stream: Stream[];
}

const Streams: NextPage = () => {
  const router = useRouter();
  const { data } = useSWR<StreamResponse>(`/api/streams/`);
  
  return (
    <Layout hasTabBar title="Live">
      <div className="py-10 divide-y-[1px] space-y-4 px-2">
        {data?.stream?.map((streams) => (
          <Link
            key={streams.id}
            href={`/streams/${streams.id}`}
            className="pt-4 block  px-4"
          >
            <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
            <h1 className="text-2xl mt-2 font-bold text-gray-900">
              {streams.name}
            </h1>
          </Link>
        ))}
        <FloatingButton href="/streams/create">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Streams;
