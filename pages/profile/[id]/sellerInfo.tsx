import { Favorite, Product, Sold, Stream, User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import Button from "components/button";
import Input from "components/input";
import Layout from "components/layout";
import useMutation from "libs/client/useMutation";
import useUser from "libs/client/useUser";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GetStaticPaths, GetStaticProps } from "next";
import useSWR from "swr";
import cls from "@libs/client/utils";

interface ProfileForm {
  image?: FileList;
  name?: string;
  email?: string;
  phone?: string;
}

interface ProductWithUser extends Product{
  favorites:Favorite[];
  user:User;
}


export interface ProductUserInfoResponse {
  ok:boolean;
  userSoldInfo:Sold[];
  soldCompletedCount:number;
  userStreamCount:Stream[];
  product : ProductWithUser;
}

export default function Info() {

  // 유저 프로필 현재 상태 표시
  const { user } = useUser();
  const router = useRouter();
  const { data:countStar } = useSWR<ProductUserInfoResponse>(`/api/products/${router.query.id}/countStar`);
   
  const favorites = countStar?.product?.favorites?.length 
  const sold = countStar?.userSoldInfo?.length 
  const compeletedSold = countStar?.soldCompletedCount 
  const stream = countStar?.userStreamCount?.length 

  const countSum = Math.floor(favorites+sold+stream+compeletedSold/8)

  const {
    register,
    setValue,
  } = useForm<ProfileForm>();

  useEffect(() => {
    if (countStar){
      setValue("name", countStar.product?.user?.name);
      setValue("email", countStar.product?.user?.email);
      setValue("phone", countStar.product?.user?.phone);
    }
  },[setValue, countStar]);


  return (
    <Layout canGoBack title="사장님 프로필" seoTitle="프로필 수정" hasTabBar>
      <form className="py-14 px-4 space-y-4">
        <div className="flex items-center">
          <div className="flex items-center justify-start">
            {user?.image ? (
              <Image
                src={`https://imagedelivery.net/u7wvD59l3UZuCFJ8LR4Yaw/${user?.image}/avatar`}
                width={112}
                height={112}
                className="w-14 h-14 rounded-full"
                alt={""}
              />
            ) : null}
          </div>
          <div className="ml-5">
            <span>{countStar?.product.user.name}</span>
          </div>

          <div className="ml-10 w-1/2 rounded-full h-2.5 bg-gray-200">
            <div
              className={cls( countSum ? `bg-purple-400 h-2.5 rounded-full w-${countSum}` : null)}
            ></div>
          </div>
        </div>

        <Input
          register={register("name")}
          required={false}
          label="닉네임"
          name="nickName"
          type="text"
          kind="text"
          disabled={true}
        />
        <Input
          register={register("email")}
          required={false}
          label="이메일 주소"
          name="email"
          type="email"
          kind="text"
          disabled={true}
        />
        <Input
          register={register("phone")}
          required={false}
          label="전화 번호"
          name="phone"
          type="text"
          kind="phone"
          disabled={true}
        />
      </form>
    </Layout>
  );
}