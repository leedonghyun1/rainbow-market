import type { NextPage } from "next";
import React from "react";
import Layout from "../components/layout";
import Button from "pages/components/button";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";
import { Product, User } from "@prisma/client";
import useMutation from "pages/libs/client/useMutation";
import cls from "pages/libs/client/utils";
import useUser from "pages/libs/client/useUser";
import Image from "next/image";

interface ProductWithuser extends Product {
  user: User;
}
interface ItemDetailResponse {
  ok:boolean;
  product: ProductWithuser;
  relatedProducts : Product[];
  isLiked : boolean;
}

const ItemDetail: NextPage = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { mutate }=useSWRConfig();
  const { data, mutate: boundMuate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [ toggleFav ] = useMutation(`/api/products/${router.query.id}/favorite`);
  const onFavClick = () => {
    if(!data) return;
    boundMuate((prev)=> prev && { ...prev, isLiked: !prev.isLiked }, false)
    // mutate("/api/users/me", (prev: any) => ({ ok: !prev?.ok }), false);
     toggleFav({})
  }

  return (
    <Layout canGoBack>
      {data ? (
        <div className="px-4 py-10">
          <div className="mb-8">
            {data?.product.image ? (
              <div className="relative pb-80">
                <Image
                  src={`https://imagedelivery.net/u7wvD59l3UZuCFJ8LR4Yaw/${data?.product.image}/public`}
                  className="rounded-md border-2 border-orange-200 object-scale-down"
                  layout="fill"
                  alt={""}
                />
              </div>
            ) : (
              <div className="h-96 rounded-md bg-orange-300" />
            )}

            <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
              {data?.product.user.avatar ? (
                //nextjs image compnent
                <Image
                  width={48}
                  height={48}
                  src={`https://imagedelivery.net/u7wvD59l3UZuCFJ8LR4Yaw/${data?.product.user.avatar}/avatar`}
                  className="w-12 h-12 rounded-full border-2 border-orange-300"
                  alt={""}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-orange-200 border-2 border-orange-300" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {data?.product?.user?.name}
                </p>
                <Link
                  className="text-xs font-medium text-gray-500"
                  href={`/users/profiles/${data?.product?.user?.id}`}
                >
                  View profile &rarr;
                </Link>
              </div>
            </div>
            <div className="mt-5">
              <h1 className="text-3xl font-bold text-gray-900">
                {data?.product?.name}
              </h1>
              <span className="text-2xl block mt-3 text-gray-900">
                {data?.product?.price}
              </span>
              <p className="my-6 text-gray-700">{data?.product?.description}</p>
              <div className="flex items-center justify-between space-x-2">
                <Button large text="Talk to seller" />
                <button
                  onClick={onFavClick}
                  className={cls(
                    "p-3 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-300",
                    data?.isLiked
                      ? "text-purple-600 bg-white hover:bg-gray-300"
                      : "text-gray-500  bg-white hover:bg-gray-300"
                  )}
                >
                  {data?.isLiked ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-purple-600"
                    >
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {data?.relatedProducts.map((relatedProd) => (
                <div key={relatedProd?.id}>
                  <div className="h-56 w-full mb-4 bg-slate-300 rounded-md" />
                  <h3 className="text-gray-700 -mb-1">{relatedProd?.name}</h3>
                  <span className="text-sm font-medium text-gray-900">
                    {relatedProd?.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        "Loading..."
      )}
    </Layout>
  );
};

export default ItemDetail;
