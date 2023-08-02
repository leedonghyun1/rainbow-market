import type { NextPage } from "next";
import React from "react";
import Layout from "components/layout";
import Message from "components/message";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Stream, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "libs/client/useMutation";
import useUser from "libs/client/useUser";
import Image from "next/image";

interface StreamMessage {
  message: string;
  id: string;
  user: {
    image?: string;
    id: string;
  };
}

interface StreamWithMessage extends Stream {
  message: StreamMessage[];
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
  const { data, mutate } = useSWR<StreamResponse>(
    router.query.id ? `/api/stream/${router.query.id}` : null,
    { refreshInterval: 1000 }
  );

  const { data: userData } = useSWR<UserResponse>("/api/users/me");
  console.log(userData);
  // const { register, handleSubmit, reset } = useForm<MessageFrom>();
  // const [ sendMessage, { loading, data:sendMessageData }] = useMutation(`/api/streams/${router.query.id}/messages`);
  // const onValid=(message:MessageFrom)=>{
  //   if (loading) return;
  //   mutate(
  //     (prev) =>
  //       prev &&
  //       ({
  //         ...prev,
  //         stream: {
  //           ...prev.stream,
  //           message: [
  //             ...prev.stream.message,
  //             { id: Date.now(), message: message.message, user: { ...user } },
  //           ],
  //         },
  //       } as any)
  //   , false);
  //   sendMessage(message);
  //   reset();
  // }
  return (
    <Layout canGoBack seoTitle={`${userData?.profile?.name} Live`} title="Live">
      <div className="py-10 px-4  space-y-4">
        <div className="w-full rounded-md shadow-sm aspect-video ">
          <iframe
            src={`https://iframe.videodelivery.net/${data?.stream?.cloudflareId}`}
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
            <p>{`${userData.profile.name}님의 홈쇼핑`}</p>
          </div>
          <div className="text-sm font-semibold text-orange-500 flex flex-col items-center justify-between">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 640 512"
            >
              <path d="M320 96C178.6 96 64 210.6 64 352v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352C0 175.3 143.3 32 320 32s320 143.3 320 320v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352C576 210.6 461.4 96 320 96zm0 192c-35.3 0-64 28.7-64 64v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352c0-70.7 57.3-128 128-128s128 57.3 128 128v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352c0-35.3-28.7-64-64-64zM160 352v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352c0-123.7 100.3-224 224-224s224 100.3 224 224v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352c0-88.4-71.6-160-160-160s-160 71.6-160 160z" />
            </svg>
            <p>주황 등급</p>
          </div>
        </div>
        <div className="mt-8 ml-3">
          <h1 className="text-3xl font-bold text-slate-600">
            {data?.stream?.name}
          </h1>
          <span className="text-sm block mt-3 text-slate-600">
            {`${data?.stream?.price} 원`}
          </span>
          <p className="my-6 text-gray-700">{data?.stream?.description}</p>
          <div className="bg-purple-300 overflow-scroll text-white flex flex-col items-left justify-center gap-2 p-2 rounded-xl">
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
          {/* <form onSubmit={handleSubmit(onValid)}>
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
          </form> */}
        </div>
      </div>
    </Layout>
  );
};

export default Streams;
