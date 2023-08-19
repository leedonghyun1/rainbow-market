import type { NextPage } from "next";
import React, { useEffect } from "react";
import Layout from "components/layout";
import Link from "next/link";
import useSWR from "swr";
import { Message, Product, Room, User } from "@prisma/client";
import Image from "next/image";
import { useFormatter } from "next-intl";

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

export interface RoomListResponse {
  ok: boolean;
  rooms: RoomWithUser[];
}

const Chats: NextPage = () => {

  const { data } = useSWR<RoomListResponse>("/api/rooms/findMyRooms")

  const format = useFormatter();

  const calTime = (time) => {
    const dateTime = new Date(time);
    const now = new Date(Date.now());
    const result = format.relativeTime(dateTime, now);
    return result;
  };

  return (
    <Layout canGoBack title="Chat" seoTitle="채팅내역" hasTabBar>
      <div className="py-10 divide-y-[1px] ">
        {data?.rooms?.map((room) =>
          room.lastChat ? (
            <Link
              href={`/chat/room/${room.id}`}
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
                <div className="flex flex-row">
                  <span className="text-gray-700 mr-1 py-1">{room.user.name}</span>
                  {/* <div className="pb-1 self-center">
                    {room.unreadMsgs ? (
                      <span className="bg-purple-500 px-1 text-white rounded-full text-xs">
                        {room.unreadMsgs || 0}
                      </span>
                    ) : null}
                  </div> */}
                </div>
                <div>
                  <span className="text-slate-400 text-xs mr-2 underline">
                    {calTime(room.timeOfLastChat)}
                  </span>
                  <span className="text-sm text-slate-500 font-semibold">
                    {room.lastChat}
                  </span>
                </div>
              </div>
            </Link>
          ) : null
        )}
      </div>
    </Layout>
  );
};

export default Chats;
