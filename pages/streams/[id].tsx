import type { NextPage } from "next";
import React, { useEffect } from "react";
import Layout from "../components/layout";
import Message from "pages/components/message";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "pages/libs/client/useMutation";
import useUser from "pages/libs/client/useUser";

interface StreamMessage {
  message: string;
  id: number;
  user: {
    avatar?:string;
    id:number
  }
}

interface StreamWithMessage extends Stream {
  message: StreamMessage[]
}

interface StreamResponse {
  ok:boolean;
  stream: StreamWithMessage;
}

interface MessageFrom {
  message: string
}

const Streams: NextPage = () => {
  const router = useRouter();
  const {user} = useUser();
  const { data, mutate } = useSWR<StreamResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null,
    { refreshInterval: 1000 }
  );
  const { register, handleSubmit, reset } = useForm<MessageFrom>();
  const [ sendMessage, { loading, data:sendMessageData }] = useMutation(`/api/streams/${router.query.id}/messages`);
  const onValid=(message:MessageFrom)=>{
    if (loading) return;
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.stream,
            message: [
              ...prev.stream.message,
              { id: Date.now(), message: message.message, user: { ...user } },
            ],
          },
        } as any)
    , false);
    sendMessage(message);
    reset();
  }
  return (
    <Layout canGoBack seoTitle={`${data?.stream?.name} Live`}>
      <div className="py-10 px-4  space-y-4">
        <div className="w-full rounded-md shadow-sm aspect-video " >
          <iframe
            src={`https://iframe.videodelivery.net/${data?.stream.cloudflareId}`}
            className="w-full aspect-video rounded-xl"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
          ></iframe>
        </div>
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.stream?.name}
          </h1>
          <span className="text-2xl block mt-3 text-gray-900">
            {data?.stream?.price}
          </span>
          <p className=" my-6 text-gray-700">{data?.stream?.description}</p>
          <div className="bg-orange-300 overflow-scroll text-white flex flex-col items-left justify-center gap-2 p-2 rounded-xl">
            <span>Stream Key (secret)</span>
            <span>
              <span>KEY: </span>
              {data?.stream?.cloudflareKey}
            </span>
            <span>
              <span>URL: </span>
              {data?.stream?.cloudflareUrl}
            </span>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <form onSubmit={handleSubmit(onValid)}>
            <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
              {data?.stream.message.map((messages) => (
                <Message
                  key={messages.id}
                  message={messages.message}
                  reversed={messages.user.id === user.id ? true : false}
                />
              ))}
            </div>
            <div className="fixed py-2 bg-white  bottom-0 inset-x-0">
              <div className="flex relative max-w-md items-center w-full mx-auto">
                <input
                  {...register("message", { required: true })}
                  type="text"
                  className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
                />
                <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                  <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
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