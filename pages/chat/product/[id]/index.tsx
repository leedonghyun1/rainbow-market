import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import React, { use, useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useUser from "libs/client/useUser";
import { Message, Product, Room, User } from "@prisma/client";
import Layout from "components/layout";
import useMutation from "@libs/client/useMutation";
import MessageList from "@components/message-list";
import client from "@libs/server/client"

interface ProductWithRoom extends Room {
  message: RoomWithMessage[];
}
interface ProductWithMessage extends Product {
  room: ProductWithRoom[];
  user: User;
}
interface ProductResponse {
  product: ProductWithMessage;
}

interface MessageFrom {
  message: string;
}

interface RoomMessage {
  message: string;
  id: string;
  user: {
    image?: string;
    id?: string;
  };
}
interface RoomWithMessage extends Room {
  message: RoomMessage[];
}
interface RoomResponse {
  ok: boolean;
  room: RoomWithMessage;
}

const ChatDetail: NextPage<ProductResponse> = ({product}) => {
  let roomState = false;
  const router = useRouter();
  const { user } = useUser();

  const { register, handleSubmit, reset } = useForm<MessageFrom>();
  const [sendMessage, { loading }] = useMutation(
    `/api/chat/product/${router.query.id}/message`
  );
  const [ createRoom ] = useMutation(
    `/api/rooms/${router.query.id}`
  );

  //아래 부분을 getStaticProps로 변경 필요.
  const { data: checkRoom, mutate } = useSWR<RoomResponse>(
    router.query.id ? `/api/rooms/${router.query.id}` : null,
    { refreshInterval: 500 }
  );

  // const { data } = useSWR<ProductResponse>(
  //   router.query.id ? `/api/chat/product/${router.query.id}` : null
  // );

  useEffect(() => {
    roomState = Boolean(checkRoom?.room);
    if (!roomState) {
      createRoom(product);
    }
    roomState = false;
  }, []);

  const onValid = (message: MessageFrom) => {
    sendMessage({ message, checkRoom });
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          room: {
            ...prev.room,
            message: [
              ...prev.room?.message,
              { id: Date.now(), message: message.message, user: { ...user } },
            ],
          },
        } as any),
      false
    );
    reset();
  };
  return (
    <Layout canGoBack seoTitle={`${product?.name} chat`}>
      <div className="py-10 px-4  space-y-4">
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {product?.name}
          </h1>
          <span className="text-2xl block mt-3 text-gray-900">
            {product?.price}
          </span>
          <p className=" my-6 text-gray-700">{product?.description}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <form onSubmit={handleSubmit(onValid)}>
            <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
              {checkRoom?.room?.message?.map((messages) => (
                <MessageList
                  key={messages?.id}
                  message={messages?.message}
                  reversed={messages?.user?.id === user?.id ? true : false}
                  image={messages?.user?.image}
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

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths:[],
    fallback:"blocking"
  }
}

export const getStaticProps: GetStaticProps = async(ctx) =>{
  if(!ctx?.params?.id){
    return {
      props:{},
    }
  }
  const product = await client.product.findFirst({
    where: {
      id: ctx?.params?.id + "",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
          id:true,
        },
      },
      room: {
        include: {
          message: {
            select: {
              id: true,
              message: true,
              user: {
                select: {
                  image: true,
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  
  return{
    props:{
      product: JSON.parse(JSON.stringify(product)),
    },
  }
}

export default ChatDetail;
