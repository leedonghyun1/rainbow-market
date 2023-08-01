import { NextPage } from "next";
import Layout from "components/layout";
import ProductList from "components/product-list";

const Favs: NextPage = () => {
  return (
    <Layout title="진열상품" canGoBack hasTabBar seoTitle="진열상품">
      <div className="flex flex-col space-y-5 pb-10 mt-12">
        <ProductList kind="sold"/>
      </div>
    </Layout>
  );
};

export default Favs;