import type { NextPage } from "next";
import React, { useContext, useEffect, useState } from "react";
import Layout from "components/layout";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Stream, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "libs/client/useMutation";
import useUser from "libs/client/useUser";
import Image from "next/image";
import MessageList from "@components/message-list";
import { io } from "socket.io-client";
import SocketIOClient from "socket.io-client";
import { ItemDetailResponse } from "pages/products/[id]";
import cls from "@libs/client/utils";
import { priceToString } from "@components/item";
import { useFormatter } from "next-intl";

interface StreamMessage {
  message: string;
  id: string;
  user: {
    image?: string;
    id: string;
  };
}

interface StreamWithMessage extends Stream {
  streamMessage: StreamMessage[];
}

interface StreamResponse {
  ok: boolean;
  stream: StreamWithMessage;
}

interface MessageFrom {
  message: string;
}
interface UserResponse {
  profile: User;
}

const Streams: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();

  const { data:streamInfo, mutate, isLoading } = useSWR<StreamResponse>(
    router.query.id ? `/api/stream/${router.query.id}` : null,
    { refreshInterval: 500 }
  );

  const { data: userData } = useSWR<UserResponse>("/api/users/me");
  const { register, handleSubmit, reset } = useForm<MessageFrom>();
  const [connected, setConnected] = useState<boolean>(false);

  const { data:findStar} = useSWR<ItemDetailResponse>(`/api/products/${router.query.id}/countStar`);

  const [key, setKey] = useState(false);

  const star =  Math.floor(findStar?.product?.user?.star/20);

  const format = useFormatter();

  const calTime = (time) => {
    const dateTime = new Date(time);
    const now = new Date(Date.now());
    const result = format.relativeTime(dateTime, now);
    return result;
  };

  useEffect(():any=>{
   
    const socket = io("http://localhost:3000", {
     path:"/api/chat/stream/socketio",
    });

    socket.on("connection",(()=>{
      console.log("Socket Connected!", socket.id);
      setConnected(true);
    }));

    if (socket) return () => socket.disconnect();
  })

  const sendMessage = async (message) => {
    const resp = await fetch(`/api/chat/stream/${router.query.id}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  const onCickKey=()=>{
    if(key===false){
      setKey(true);
    } else{
      setKey(false);
    }
  }

  const onValid=(message:MessageFrom)=>{
    if (isLoading) return;

    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.stream,
            message: [
              ...prev.stream.streamMessage,
              { id: Date.now(), message: message, user: { ...user } },
            ],
          },
        } as any)
    , false);

    sendMessage(message);
    reset();
  }
  return (
    <Layout canGoBack seoTitle={`${userData?.profile?.name} Live`} title="Live">
      <div className="py-10 px-4  space-y-4">
        <div className="w-full rounded-md shadow-sm aspect-video ">
          <iframe
            src={`https://iframe.videodelivery.net/${streamInfo?.stream?.cloudflareId}`}
            className="w-full aspect-video rounded-xl"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
          ></iframe>
        </div>
        <div className="flex justify-between items-center relative mt-5">
          {userData?.profile?.image ? (
            <Image
              src={`https://imagedelivery.net/u7wvD59l3UZuCFJ8LR4Yaw/${userData.profile.image}/avatar`}
              width={40}
              height={40}
              className="w-12 h-12 rounded-full"
              alt={""}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-slate-500 " />
          )}
          <div className="text-sm text-gray-700 absolute left-14">
            <span className="text-lg text-slate-500 font-semibold">{`${userData?.profile?.name}님의 홈쇼핑`}</span>
          </div>
          <div className="absolute right-12">
            <button
              className="bg-purple-300 p-2 rounded-full hover:bg-purple-400 transition-all block "
              onClick={onCickKey}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                />
              </svg>
            </button>
          </div>
          <div className="text-sm font-semibold text-purple-500 flex flex-col items-center right-12 w-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="rgb(168 85 247)"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
            <div className="w-full rounded-full h-2.5 bg-gray-200 mt-1">
              <div
                className={cls(`bg-purple-400 h-2.5 rounded-full w-${star}`)}
              ></div>
            </div>
          </div>
        </div>
        <div className="mt-8 ml-3">
          <div className="border-t border-b py-6 mb-10">
              <div className="flex flex-row mb-5 justify-center">
                <div
                  className={cls(
                    "border overflow-scroll text-slate-700 flex-col gap-2 p-2 rounded-xl text-xs hover:bg-red-300 hover:text-white hover:font-semibold transition-all",
                    key === true ? "flex" : "hidden"
                  )}
                >
                  <span className="text-sm font-semibold text-center">
                    노출 시 동일 방송 생성이 가능하므로 노출이 되지 않게
                    해주세요.
                  </span>
                  <span>
                    <span>KEY: {streamInfo?.stream?.cloudflareKey}</span>
                  </span>
                  <span>
                    <span>URL: </span>
                    {streamInfo?.stream?.cloudflareUrl}
                  </span>
                </div>
              </div>
            <div className="flex flex-row justify-between">
              <span className="text-lg font-bold text-slate-600">
                {streamInfo?.stream?.name}
              </span>
              <span className="text-sm mt-3 text-slate-700 font-semibold">
                {priceToString(streamInfo?.stream?.price)}원
              </span>
            </div>
            <div className="text-xs text-slate-400 underline">
              <span>{calTime(streamInfo?.stream?.updatedAt)}</span>
              <span>{` • 시청자수 20명`}</span>
            </div>
            <div className="mt-5">
              <span className="text-slate-700 text-md">
                {streamInfo?.stream?.description}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white bg-purple-200 w-1/6 text-center rounded-md mx-3 mb-10">
            Live Chat
          </h2>
          <form onSubmit={handleSubmit(onValid)}>
            <div className="py-2 pb-16 h-[65vh] overflow-y-scroll px-4 space-y-4">
              {streamInfo?.stream?.streamMessage?.map((messages) => (
                <MessageList
                  key={messages.id}
                  message={messages.message}
                  reversed={messages.user?.id === user?.id ? true : false}
                  image={messages.user?.image}
                  status={false}
                />
              ))}
            </div>
            <div className="fixed py-2 bg-white  bottom-0 inset-x-0">
              <div className="flex relative max-w-md items-center w-full mx-auto">
                <input
                  {...register("message", { required: true })}
                  type="text"
                  className="shadow-sm rounded-full w-full border-gray-300 focus:ring-purple-500 focus:outline-none pr-12 focus:border-purple-500"
                />
                <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                  <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 items-center bg-purple-500 rounded-full px-3 hover:bg-purple-600 text-sm text-white">
                    &rarr;
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Streams;
