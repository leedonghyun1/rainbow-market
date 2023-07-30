import { NextPage } from "next";
import Layout from "pages/components/layout";
import ProductList from "pages/components/product-list";


const Favs: NextPage = () => {
  return (
    <Layout title="관심슈퍼" canGoBack hasTabBar seoTitle="관심슈퍼">
      <div className="flex flex-col space-y-5 pb-10  divide-y mt-10">
        <ProductList kind="favs" />
      </div>
    </Layout>
  );
};

export default Favs;