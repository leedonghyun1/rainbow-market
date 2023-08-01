import { NextPage } from "next";
import Layout from "components/layout";
import ProductList from "components/product-list";

const Favs: NextPage = () => {
  return (
    <Layout title="관심슈퍼" canGoBack hasTabBar seoTitle="관심슈퍼">
      <div className="flex flex-col space-y-5 pb-10 mt-12">
        <ProductList kind="purchases"/>
      </div>
    </Layout>
  );
};

export default Favs;