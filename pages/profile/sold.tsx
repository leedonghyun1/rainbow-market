import { Product } from "@prisma/client";
import type { NextPage } from "next";
import { ProductWithFavsCount } from "pages";
import Item from "pages/components/item";
import Layout from "pages/components/layout";
import ProductList from "pages/components/product-list";
import React from "react";
import useSWR from "swr";



const Sold: NextPage = () => {

  return (
    <Layout title="판매내역" canGoBack>
      <div className="flex flex-col space-y-5 pb-10  divide-y">
        <ProductList kind="sold" />
      </div>
    </Layout>
  );
};

export default Sold;
