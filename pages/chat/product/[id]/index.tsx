import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import React, { useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useUser from "libs/client/useUser";
import { Product, Room, Sold, User } from "@prisma/client";
import Layout from "components/layout";
import useMutation from "@libs/client/useMutation";
import MessageList from "@components/message-list";
import client from "@libs/server/client"
import cls from "@libs/client/utils";

interface ProductRoomWithMessage {
  message:string;
  id: string;
  user: {
    image?: string;
    id?: string;
  };
}

interface ProductWithMessage extends Room {
  message:ProductRoomWithMessage[];
}

interface ProductWithRoom extends Product {
  room: ProductWithMessage[];
  sold:Sold[];
  user:User;
}
interface ProductResponse {
  product: ProductWithRoom;
}

interface MessageFrom {
  message: string;
}

interface RoomMessage {
  message: string;
  id: string;
  readOrNot:boolean;
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
interface FcmTokenResponse{
  ok:boolean;
  fcmToken:string;
}

const ChatDetail: NextPage<ProductResponse> = ({product}) => {
  const router = useRouter();
  const { user } = useUser();


  const { register, handleSubmit, reset } = useForm<MessageFrom>();

  const [sendMessage] = useMutation(
    `/api/chat/product/${router.query.id}/message`
  );
  const { data: checkRoomAndMsg, mutate } = useSWR<RoomResponse>(
    router.query.id ? `/api/rooms/${router.query.id}` : null,
    {
      refreshInterval: 500,
    }
  );

  const { data, mutate: boundMutate } = useSWR<RoomResponse>(
    `/api/rooms/${router.query.id}`,
    { refreshInterval: 1000, revalidateOnFocus: true }
  );

  const [ updateReadOrNot, {data: updateRoNdata , loading} ] = useMutation(`/api/chat/product/${router.query.id}/updateReadOrNot`);

  const [ fcmNotisHandler ] = useMutation<FcmTokenResponse>("/api/chat/fcmNotisHandler");

  useEffect(() => {
    if (!data) return;
    if (user?.id === checkRoomAndMsg?.room?.productOwnerId || user?.id === checkRoomAndMsg?.room?.userId) {
      boundMutate(data.room.message.map((message)=>{
        message.readOrNot = true;
      }) as any,false)
      updateReadOrNot({ checkRoomAndMsg });
    }

  },[boundMutate]);

  //usePushNotification custom hook

  const usePushNotification = (notisTitle, notisBody ) =>{

    const title = notisTitle;
    const body = notisBody;
    const icon = "/images/logo/transparent.svg";
    const options = { body, icon}

   
    const notif = new Notification(title, options);
  }
  // FCM target notification.

  const onValid = async (message: MessageFrom) => {
    // const notisResult = await Notification.requestPermission();
    sendMessage({ message, checkRoomAndMsg });
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

    if (checkRoomAndMsg?.room?.userId !== user?.id) {
      const userid = checkRoomAndMsg?.room?.userId;
      fcmNotisHandler({ message, userid });
    } 
    if (checkRoomAndMsg?.room?.productOwnerId !== user?.id) {
      const userid = checkRoomAndMsg?.room?.productOwnerId;
      fcmNotisHandler({ message, userid });
    }

    reset();
    // usePushNotification(product?.user?.name, message.message);
  };

  return (
    <Layout canGoBack title={product.user.name} seoTitle={`${product?.name} chat`}>
      <div className="py-2 px-4  space-y-4">
        <div className="mt-5 flex flex-row border-b py-2">
          <div>
            <img
              className="w-14 h-12 bg-gray-400 rounded-md shadow-lg"
              src={`https://customer-odn2bz8flwihe8yi.cloudflarestream.com/${product.uploadVideo}/thumbnails/thumbnail.jpg?time=1s&height=48`}
            />
          </div>
          <div className="flex flex-col ml-3">
            <span className="text-sm text-gray-500 font-semibold underline mb-1">
              {product?.price} 원
            </span>
            <div
              className={cls(
                "flex items-end justify-between px-3 rounded-md text-sm mr-3 self-center",
                product.sold[0].saleIs === false
                  ? "bg-slate-300"
                  : "bg-purple-400"
              )}
            >
              {product.sold[0].saleIs === false ? "판매중" : "판매완료"}
            </div>
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-gray-600">{product?.name}</h1>
            <p className="text-sm text-gray-700">{product?.description}</p>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit(onValid)}>
            <div className="py-2 pb-16 h-[65vh] overflow-y-scroll px-4 space-y-4">
              {checkRoomAndMsg?.room?.message?.map((messages) => (
                <MessageList
                  key={messages.id}
                  message={messages.message}
                  reversed={messages.user?.id === user?.id ? true : false}
                  image={messages.user?.image}
                  readOrNot={messages.readOrNot}
                  status={true}
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
      sold:{
        select:{
          saleIs:true,
        }
      }
    },
  });

  return{
    props:{
      product: JSON.parse(JSON.stringify(product)),
    },
  }
}

export default ChatDetail;
