import type { NextPage } from "next";
import React from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useUser from "libs/client/useUser";
import { Message, Product, Room } from "@prisma/client";
import Layout from "components/layout";
import useMutation from "@libs/client/useMutation";
import MessageList from "@components/message-list";
import message from "pages/api/chat/product/[id]/message";


interface ProductWithRoom extends Room {
  message: RoomWithMessage[]
}

interface ProductWithMessage extends Product {
  room: ProductWithRoom[];
}

interface ProductResponse {
  ok: boolean;
  product: ProductWithMessage;
}

interface MessageFrom {
  messageInput: string;
}

interface RoomMessage {
  message: string;
  id: string;
  user: {
    image?:string;
    id?:string
  }
}

interface RoomWithMessage extends Room {
  message: RoomMessage[];
}

interface RoomResponse {
  room: RoomWithMessage;
}

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data } = useSWR<ProductResponse>(
    router.query.id ? `/api/chat/product/${router.query.id}` : null
  );

  const { register, handleSubmit, reset } = useForm<MessageFrom>();
  const [sendMessage, { loading }] = useMutation(
    `/api/chat/product/${router.query.id}/message`
  );
  const [createRoom] = useMutation(`/api/rooms/${router.query.id}`);

  const { data: checkRoom, mutate } = useSWR<RoomResponse>(
    router.query.id ? `/api/rooms/${router.query.id}` : null,
    { refreshInterval: 1000 }
  );

  const onValid=(messageInput:MessageFrom)=>{
    if (loading) return;
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          room: {
            ...prev.room,
            message: [
              ...prev.room.message,
              { id: Date.now(), message: messageInput.messageInput, user: { ...user } },
            ],
          },
        } as any)
    , false);
    if(checkRoom.room){
      sendMessage({messageInput, checkRoom});
    }else{
      createRoom({})
      sendMessage({messageInput, checkRoom});
    }
    reset();
  }


  return (
    <Layout canGoBack seoTitle={`${data?.product?.name} chat`}>
      <div className="py-10 px-4  space-y-4">
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.product?.name}
          </h1>
          <span className="text-2xl block mt-3 text-gray-900">
            {data?.product?.price}
          </span>
          <p className=" my-6 text-gray-700">{data?.product?.description}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <form onSubmit={handleSubmit(onValid)}>
            <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
              { checkRoom?.room?.message?.map((messages) => (
                    <MessageList
                      key={messages?.id}
                      message={messages?.message}
                      reversed={messages?.user?.id === user?.id ? true : false}
                      image={messages?.user?.image}
                    />
                  ))
              }
            </div>
            <div className="fixed py-2 bg-white  bottom-0 inset-x-0">
              <div className="flex relative max-w-md items-center w-full mx-auto">
                <input
                  {...register("messageInput", { required: true })}
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

export default ChatDetail;