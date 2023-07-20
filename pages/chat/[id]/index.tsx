import type { NextPage } from "next";
import React, { useEffect } from "react";
import Message from "pages/components/message";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useMutation from "pages/libs/client/useMutation";
import useUser from "pages/libs/client/useUser";
import { Product, Room, User } from "@prisma/client";
import Layout from "pages/components/layout";
import { io } from "socket.io-client";
let socket;
interface ProductMessage {
  message: string;
  id: string;
  user: {
    image?: string;
    id: string;
  };
}

interface ProductWithMessage extends Product {
  message: ProductMessage[];
}

interface ProductResponse {
  ok: boolean;
  product: ProductWithMessage;
}

interface MessageFrom {
  message: string;
}

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data } = useSWR<ProductResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null,
    { refreshInterval: 1000 }
  );
  const { register, handleSubmit, reset } = useForm<MessageFrom>();
  const [sendMessage, { loading, data: sendMessageData }] = useMutation(
    `/api/products/${router.query.id}/messages`
  );


  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/chat/server");
    };
    socketInitializer();
    socket = io("http://localhost:3000",{
      transports: ["websocket"]
    });
    socket.emit("enter_room", router.query.id, user.id, data);
    socket.on("disconnect",()=>{
      console.log("disconnected")
    })
  }, []);

  const onValid = (message: MessageFrom) => {
    if (loading) return;
    //1초마다 mutate
    // mutate(
    //   (prev) =>
    //     prev &&
    //     ({
    //       ...prev,
    //       product: {
    //         ...prev.product,
    //         message: [
    //           ...prev.product.message,
    //           { id: Date.now(), message: message.message, user: { ...user } },
    //         ],
    //       },
    //     } as any)
    // , false);
    
    socket.emit("new_message", router.query.id, user.email, data, message);
    socket.on("receive_message", () => {
    //  mutate(
    //     (newMessage) =>
    //       newMessage &&
    //       ({
    //         ...newMessage,
    //         product: {
    //           ...newMessage.product,
    //           message: [
    //             ...newMessage.product.message,
    //             { id: Date.now(), message: message.message, user: { ...user } },
    //           ],
    //         },
    //       } as any),
    //     false
    //   );
    });
    // sendMessage(message);
    reset();
  };
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
              {data?.product.message.map((messages) => (
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

export default ChatDetail;
