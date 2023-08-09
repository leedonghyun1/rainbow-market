import type { NextPage } from "next";
import React, { useEffect } from "react";
import Layout from "components/layout";
import Link from "next/link";
import useSWR from "swr";
import { Message, Product, Room, User } from "@prisma/client";
import Image from "next/image";

interface ReadOrNotWithMsg {
  id: string;
  readOrNot: boolean;
}

interface MessageWithUser extends User {
  email: string;
  image: string;
  message: ReadOrNotWithMsg[];
}

interface RoomWithUser extends Room{
  user:MessageWithUser;
  product:Product;
}

interface RoomListResponse {
  ok: boolean;
  rooms: RoomWithUser[];
}

const Chats: NextPage = () => {

  const { data } = useSWR<RoomListResponse>("/api/rooms/findMyRooms")

  return (
    <Layout canGoBack title="Chat" seoTitle="채팅내역" hasTabBar>
      <div className="py-10 divide-y-[1px] ">
        {data?.rooms?.map((room) =>
          room.lastChat ? (
            <Link
              href={`/chat/product/${room.productId}`}
              key={room.id}
              className="flex px-4 cursor-pointer py-3 items-center space-x-3"
            >
              {room.user.image ? (
                <Image
                  src={`https://imagedelivery.net/u7wvD59l3UZuCFJ8LR4Yaw/${room.user.image}/avatar`}
                  width={40}
                  height={40}
                  className="w-12 h-12 rounded-full"
                  alt={""}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-300" />
              )}
              <div>
                <div className="flex">
                  <p className="bg-slate-300 px-2 self-center text-sm rounded-md text-gray-500">
                    물품
                  </p>
                  <p className="text-gray-700 p-1">{room.product.name}</p>
                  <div className="self-center pb-1">
                    <span className="bg-purple-500 px-1 text-white rounded-full text-xs">
                      7
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{room.lastChat}</p>
              </div>
            </Link>
          ) : null
        )}
      </div>
    </Layout>
  );
};

export default Chats;
