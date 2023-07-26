import { Product, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import Button from "pages/components/button";
import Layout from "pages/components/layout";
import useMutation from "pages/libs/client/useMutation";
import useUser from "pages/libs/client/useUser";
import cls from "pages/libs/client/utils";
import { useEffect } from "react";
import useSWR from "swr";

interface ProductWitheUser extends Product {
  user: User;
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWitheUser;
  relatedProducts:Product[];
  isLiked: boolean;
}
export interface ItemDeleteResponse {
  ok:boolean;
  deleteProduct : Product;
}

export default function ItemDetails(req: NextApiRequest, res: NextApiResponse) {
  const router = useRouter();
  const { user } = useUser();
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [ toggleFav ] = useMutation(`/api/products/${router.query.id}/favorite`);
  const [ deletePost,{ data:postDeleteData } ] = useMutation<ItemDeleteResponse>(`/api/products/${router.query.id}`);

  const onFavClicked = () => {
    if (!data) return;
    boundMutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    toggleFav({});
  };
  const deletePostClicked = async() => {
    try{
      deletePost({});
      const deleteVideoResponse = await(await fetch(`/api/video/${router.query.id}/deleteVideo`)).json();
      if (postDeleteData !== null && deleteVideoResponse.ok === true) {
        router.push("/");
      }
    }catch(error){
      console.log("delete post error : ", error);
    }
  };

  const changePostClicked = async() =>{
    router.replace(`/products/${router.query.id}/edit`);
  }


  return (
    <Layout canGoBack seoTitle="상품상세" hasTabBar title="슈퍼">
      {data ? (
        <div className="px-4 py-10">
          <div className="mb-8">
            {data.product.uploadVideo ? (
              <iframe
                src={`https://customer-odn2bz8flwihe8yi.cloudflarestream.com/${data?.product?.uploadVideo}/iframe`}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                className="h-96 w-full rounded-lg"
              ></iframe>
            ) : (
              <div className="relative">
                <div className="h-96 w-full bg-gray-600 rounded-lg" />
              </div>
            )}
          </div>
          <div className="flex flex-row justify-end">
            <button
              className="p-2 bg-slate-400 text-white rounded-md text-sm hover:bg-purple-500 hover:text-white"
              onClick={changePostClicked}
            >
              게시글 변경
            </button>
          </div>
          {user && user.id !== data.product.userId ? (
            <Button
              large
              text="사장님에게 채팅톡톡"
              onClick={() => {
                router.push(`/chat/${data?.product?.id}`);
              }}
            />
          ) : null}

          <div className="flex justify-between items-center relative mt-5">
            {user?.image ? (
              <Image
                src={`https://imagedelivery.net/u7wvD59l3UZuCFJ8LR4Yaw/${user?.image}/avatar`}
                width={40}
                height={40}
                className="w-12 h-12 rounded-full"
                alt={""}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-500 " />
            )}
            <div className="text-sm text-gray-700 absolute left-14">
              <p>이동현 님의 프로필</p>
            </div>
            <div className="absolute text-sm font-semibold text-orange-500 flex flex-col items-center right-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 640 512"
              >
                <path d="M320 96C178.6 96 64 210.6 64 352v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352C0 175.3 143.3 32 320 32s320 143.3 320 320v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352C576 210.6 461.4 96 320 96zm0 192c-35.3 0-64 28.7-64 64v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352c0-70.7 57.3-128 128-128s128 57.3 128 128v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352c0-35.3-28.7-64-64-64zM160 352v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352c0-123.7 100.3-224 224-224s224 100.3 224 224v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352c0-88.4-71.6-160-160-160s-160 71.6-160 160z" />
              </svg>
              <p>주황 등급</p>
            </div>
            <button
              onClick={onFavClicked}
              className={cls(
                "p-2 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-300",
                data?.isLiked
                  ? "text-purple-600 bg-white hover:bg-gray-300"
                  : "text-gray-500  bg-white hover:bg-gray-300"
              )}
            >
              {data?.isLiked ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                  className="mr-1 w-4 h-4 text-purple-600"
                >
                  <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                  className="mr-1 w-4 h-4"
                >
                  <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                </svg>
              )}
            </button>
          </div>
          <div className="mt-8 mb-8 relative">
            <div className="flex items-center justify-between ">
              <div className="text-lg text-gray-600 font-semibold pl-2">
                <span>{data?.product?.name}</span>
              </div>
              <div className="text-gray-700 font-semibold text-lg">
                <span>{data?.product?.price}</span>
                <span>₩</span>
              </div>
            </div>
            <div>
              {/* image 처리 필요 */}
              <span className="left-10">{data?.product?.link}</span>
            </div>
          </div>
          <div>
            <div className="px-2 flex flex-col">
              <span className="text-lg text-gray-700 font-semibold mb-3">
                슈퍼설명
              </span>
              <span>{data?.product?.description}</span>
            </div>
          </div>
          <div className="mt-10">
            <h2 className="text-lg font-bold text-gray-500">비슷한 관심상품</h2>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {data?.relatedProducts.map((relatedProd) => (
                <div key={relatedProd?.id}>
                  {relatedProd?.uploadVideo ? (
                    <img
                      className="w-auto h-56 bg-gray-400 rounded-md"
                      src={`https://customer-odn2bz8flwihe8yi.cloudflarestream.com/${relatedProd?.uploadVideo}/thumbnails/thumbnail.jpg?time=1s&width=224`}
                    />
                  ) : (
                    <div className="h-56 w-full mb-4 bg-slate-300 rounded-md" />
                  )}
                  <h3 className="text-gray-700 -mb-1">{relatedProd?.name}</h3>
                  <span className="text-sm font-medium text-gray-900">
                    {relatedProd?.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {user && user.id === data.product.userId ? (
            <div>
              <Button
                className="w-1/2"
                text="게시글 삭제하기"
                onClick={() => {
                  deletePostClicked();
                }}
              />
            </div>
          ) : null}
        </div>
      ) : (
        "Loading..."
      )}
    </Layout>
  );
}
