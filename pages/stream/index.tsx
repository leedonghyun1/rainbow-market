import type { NextPage } from "next";
import React from "react";
import Layout from "components/layout";
import Link from "next/link";
import FloatingButton from "components/floating-button";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Stream, User } from "@prisma/client";
import Image from "next/image"; 
import { priceToString } from "@components/item";
import { useFormatter } from "next-intl";


interface StreamWithUser extends Stream{
  user:User;
}

interface StreamResponse {
  ok: boolean;
  stream: StreamWithUser[];
}

const Streams: NextPage = () => {
  const { data } = useSWR<StreamResponse>(`/api/stream`);



  const format = useFormatter();

  const calTime = (time) => {
    const dateTime = new Date(time);
    const now = new Date(Date.now());
    const result = format.relativeTime(dateTime, now);
    return result;
  };

  return (
    <Layout canGoBack hasTabBar title="Live" seoTitle="Live">
      <div className="py-10 px-2 grid grid-cols-2">
        {data
          ? data?.stream?.map((streams) => (
              <Link
                key={streams.id}
                href={`/stream/${streams.id}`}
                className="pt-4 block px-4"
              >
                {streams?.cloudflareId ? (
                  <iframe
                    src={`https://customer-odn2bz8flwihe8yi.cloudflarestream.com/${streams?.cloudflareId}/iframe`}
                    className="w-full h-auto aspect-video rounded-xl"
                    allow="accelerometer; gyroscope; encrypted-media; picture-in-picture;"
                  ></iframe>
                ) : (
                  <div className="w-full relative rounded-md shadow-sm bg-slate-300 aspect-video" />
                )}
                <div className="flex flex-row mt-2">
                  {streams.user?.image ? (
                    <Image
                      src={`https://imagedelivery.net/u7wvD59l3UZuCFJ8LR4Yaw/${streams.user.image}/avatar`}
                      width={40}
                      height={40}
                      className="w-12 h-12 rounded-full self-center"
                      alt={""}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-500 " />
                  )}
                  <div className="ml-2 flex flex-col">
                    <span className="text-sm mt-2 text-slate-700">
                      {streams.name}
                    </span>
                    <div className="text-[0.5rem] text-slate-400">
                      <span>{calTime(streams.updatedAt)}</span>
                      <span>{` • 시청자수 20명`}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {priceToString(streams.price)}원
                    </span>
                  </div>
                </div>
              </Link>
            ))
          : null}
        <FloatingButton href="/stream/create">
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
