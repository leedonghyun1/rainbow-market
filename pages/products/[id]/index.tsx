import { Product, Room, Sold, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import Button from "components/button";
import Layout from "components/layout";
import useMutation from "libs/client/useMutation";
import useUser from "libs/client/useUser";
import cls from "libs/client/utils";
import useSWR from "swr";

interface ProductWitheUser extends Product {
  user: User;
  sold: Sold[];
  room: Room[];
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWitheUser;
  relatedProducts: Product[];
  isLiked: boolean;
}
export interface ItemDeleteResponse {
  ok: boolean;
  deleteProduct: Product;
}

interface SoldResponse {
  ok: boolean;
}

export default function ItemDetails(req: NextApiRequest, res: NextApiResponse) {
  const router = useRouter();
  const { user } = useUser();
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  
  const { data:productRoomData } = useSWR<ItemDetailResponse>(`/api/products/${router.query.id}`);
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/favorite`);
  const [toggleSold] = useMutation<SoldResponse>(
    `/api/products/${router.query.id}/sold`
  );
  const [deletePost, { data: postDeleteData }] =
    useMutation<ItemDeleteResponse>(`/api/products/${router.query.id}`);

  const onFavClicked = () => {
    if (!data) return;
    boundMutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    toggleFav({});
  };

  const onSoldClicked = () => [toggleSold({})];
  const deletePostClicked = async () => {
    try {
      deletePost({});
      const deleteVideoResponse = await (
        await fetch(`/api/video/${router.query.id}/deleteVideo`)
      ).json();
      if (postDeleteData !== null && deleteVideoResponse.ok === true) {
        router.push("/");
      }
    } catch (error) {
      console.log("delete post error : ", error);
    }
  };

  const changePostClicked = async () => {
    router.replace(`/products/${router.query.id}/edit`);
  };

  const [ createRoom ] = useMutation(`/api/rooms/${router.query.id}`);

  const onRoomValid = () => {
    console.log(productRoomData);
    if (productRoomData.product?.room?.length === 0) {
      createRoom(data.product.userId);
      router.push(`/chat/product/${router.query.id}`);
    } else {
      productRoomData.product?.room?.map((room) => {
        if (user?.id === room.userId || user?.id === room.productOwnerId) {
          router.push(`/chat/product/${router.query.id}`);
        } else {
          // 상품의 채팅룸이 있으나 본인이 생성한 룸이 없을 때  ( 룸이 여러개이기 때문 )
          createRoom(data.product.userId);
          router.push(`/chat/product/${router.query.id}`);
        }
      });
    }
  };

  return (
    <Layout canGoBack seoTitle="상품상세" hasTabBar title="슈퍼">
      {data ? (
        <div className="px-4 py-10">
          <div className="mb-8">
            {data?.product?.uploadVideo ? (
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
          {user && user.id === data?.product?.userId ? (
            <div className="flex flex-row justify-between">
              <button
                className={cls(
                  "px-6 rounded-2xl text-sm",
                  data.product.sold[0].saleIs === false
                    ? "bg-slate-300  text-slate-600  hover:bg-purple-400 hover:text-white hover:font-semibold"
                    : "bg-purple-400"
                )}
                onClick={onSoldClicked}
              >
                {data.product.sold[0].saleIs === false ? "판매중" : "판매완료"}
              </button>
              <button
                className="p-2 bg-slate-300 text-slate-600 rounded-md text-sm hover:bg-purple-500 hover:text-white"
                onClick={changePostClicked}
              >
                게시글 변경
              </button>
            </div>
          ) : null}
          {user && user.id !== data?.product?.userId ? (
            <Button large text="사장님에게 채팅톡톡" onClick={onRoomValid} />
          ) : null}

          <div className="flex justify-between items-center relative mt-5">
            {data?.product?.user?.image ? (
              <Image
                src={`https://imagedelivery.net/u7wvD59l3UZuCFJ8LR4Yaw/${data.product.user.image}/avatar`}
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
              {user && user.id !== data?.product?.userId ? (
                data?.isLiked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6 mr-1 bg-purple-500 text-white rounded-lg p-1"
                  >
                    <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6 mr-1 bg-slate-300 text-gray-600 rounded-lg p-1"
                  >
                    <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                )
              ) : null}
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
              {data?.relatedProducts?.map((relatedProd) => (
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
          {user && user.id === data?.product?.userId ? (
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
