import { NextPage } from "next";
import Layout from "components/layout";
import ProductList from "components/product-list";

const Favs: NextPage = () => {
  return (
    <Layout title="나의슈퍼" canGoBack hasTabBar seoTitle="나의슈퍼">
      <div className="flex flex-col space-y-5 pb-10 mt-12">
        <ProductList kind="sell"/>
      </div>
    </Layout>
  );
};

export default Favs;