import type { NextPage } from "next";
import Item from "pages/components/item";
import Layout from "pages/components/layout";
import ProductList from "pages/components/product-list";
import React from "react";

const Loved: NextPage = () => {
  return (
    <Layout title="관심목록" canGoBack>
      <div className="flex flex-col space-y-5 pb-10  divide-y">
        <ProductList kind="favs" />
      </div>
    </Layout>
  );
};

export default Loved;