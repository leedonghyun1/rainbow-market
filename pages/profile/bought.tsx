import type { NextPage } from "next";
import Item from "pages/components/item";
import Layout from "pages/components/layout";
import ProductList from "pages/components/product-list";
import React from "react";

const Bought: NextPage = () => {
  return (
    <Layout title="구매내역" canGoBack>
      <div className="flex flex-col space-y-5 pb-10  divide-y">
        <ProductList kind="purchases" />
      </div>
    </Layout>
  );
};

export default Bought;
