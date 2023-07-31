import { Product, User } from "@prisma/client";
import Item from "./components/item";
import Layout from "./components/layout";
import { NextPage } from "next";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import useMutation from "../libs/client/useMutation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { after } from "node:test";

export interface ProductWithFavsCount extends Product {
  _count: {
    favorites: number;
  };
}

interface ProductReponse {
  ok: Boolean;
  products: ProductWithFavsCount[];
}
interface loginMutation {
  ok: Boolean;
}

const Home: NextPage = () => {
  const { data } = useSWR<ProductReponse>("/api/products");
  const { data: session } = useSession();
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
      login(session.user.email);
    }
  }, []);

  const searchItem = (item) => {
    search(item);
    reset();
    afterSearch(true);
  }
 
  return (
    <div>
      <Layout seoTitle="메인 페이지" hasTabBar canGoBack title="홈">
        <form onSubmit={handleSubmit(searchItem)}>
          <div className="flex flex-col space-y-5 py-10">
            <input
              {...register("find")}
              placeholder="검색"
              type="text"
              className="w-1/2 h-auto rounded-2xl self-center hover:outline-purple-400"
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
                  />
                ))}
          </div>
        </form>
      </Layout>
    </div>
  );
};

export default Home;
