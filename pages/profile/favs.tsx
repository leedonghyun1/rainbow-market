import Layout from "pages/components/layout";
import ProductList from "pages/components/product-list";


export default function Favs(){
  return (
    <Layout title="관심슈퍼" canGoBack hasTabBar seoTitle="관심슈퍼">
      <ProductList kind="favs" />
    </Layout>
  );
}