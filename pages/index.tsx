import { Product, Sold } from "@prisma/client";
import Item from "../components/item";
import Layout from "../components/layout";
import { NextPage } from "next";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import useMutation from "../libs/client/useMutation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FloatingButton from "@components/floating-button";

export interface ProductWithCount extends Product {
  _count: {
    favorites: number;
    room:number;
  };
  sold:Sold[];
}

interface ProductReponse {
  ok: Boolean;
  products: ProductWithCount[];
}
interface loginMutation {
  ok: Boolean;
}

const Home: NextPage = () => {
  const { data } = useSWR<ProductReponse>("/api/products");
  const { data: session } = useSession();
  const { data: notificationUpdate } = useSWR("/api/users/me/notification");
  const { register, handleSubmit, watch, reset } = useForm();
  const [login, { loading, data: tokenData, error }] =
    useMutation<loginMutation>("/api/users/token");
  const [
    search,
    { data: searchData, loading: searchLoading, error: searchError },
  ] = useMutation<ProductReponse>("/api/search");

  const [beforeSearch, afterSearch] = useState(false);

  useEffect(() => {
    if (session) {
      login(session);
    }
  }, []);

  const searchItem = (item) => {
    search(item);
    reset();
    afterSearch(true);
  }

  console.log(notificationUpdate?.unreadMsgCount);
  
  return (
    <div>
      <Layout seoTitle="슈퍼" hasTabBar canGoBack title="슈퍼" notificationNum={notificationUpdate?.unreadMsgCount}>
        <form onSubmit={handleSubmit(searchItem)}>
          <div className="flex flex-col space-y-5  py-10">
            <input
              {...register("find")}
              placeholder="슈퍼 검색"
              type="text"
              className="w-2/3 h-9 rounded-2xl self-center hover:outline-purple-400 placeholder-slate-400"
            />
            {beforeSearch === false
              ? data?.products?.map((product) => (
                  <Item
                    id={product.id}
                    title={product.name}
                    price={product.price}
                    favorite={product._count?.favorites || 0}
                    key={product.id}
                    image={product.uploadVideo}
                    sold={product.sold[0].saleIs}
                    room={product._count?.room || 0}
                  />
                ))
              : searchData
              ? searchData?.products?.map((product) => (
                  <Item
                    id={product.id}
                    title={product.name}
                    price={product.price}
                    favorite={product._count?.favorites || 0}
                    key={product.id}
                    image={product.uploadVideo}
                    sold={product.sold[0].saleIs}
                    room={product._count?.room || 0}
                  />
                ))
              : data?.products?.map((product) => (
                  <Item
                    id={product.id}
                    title={product.name}
                    price={product.price}
                    favorite={product._count?.favorites || 0}
                    key={product.id}
                    image={product.uploadVideo}
                    sold={product.sold[0].saleIs}
                    room={product._count?.room || 0}
                  />
                ))}
          </div>
        </form>
        <FloatingButton href="/products/upload">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </FloatingButton>
      </Layout>
    </div>
  );
};

export default Home;
