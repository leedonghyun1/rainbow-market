import { Product, User } from "@prisma/client";
import Item from "./components/item";
import Layout from "./components/layout";
import { NextPage } from "next";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import useMutation from "./libs/client/useMutation";
import { useEffect } from "react";

export interface ProductWithFavsCount extends Product{
  _count:{
    favorite: number;
  }
}

interface ProductReponse {
  ok:Boolean;
  products: ProductWithFavsCount[];
}
interface loginMutation {
  ok: Boolean;
}

const Home: NextPage = () => {

  const { data } = useSWR<ProductReponse>("/api/products");
  const { data: session } = useSession();

  //useMutation
  const [login, { loading, data:tokenData, error }] =
    useMutation<loginMutation>("/api/users/token");

  useEffect(()=>{
    if (session) {
      login(session.user.email);
    }
  },[]);

  return (
    <div>
      <Layout seoTitle="메인 페이지" hasTabBar canGoBack title="홈">
        <div className="flex flex-col space-y-5 py-10">
          { data?.products?.map((product) => (
            <Item
              id={product.id}
              title={product.name}
              price={product.price}
              favorite={product._count?.favorite || 0}
              key={product.id}
              image={product.uploadVideo}
            />
          ))}
        </div>
      </Layout>
    </div>
  );
}

export default Home;