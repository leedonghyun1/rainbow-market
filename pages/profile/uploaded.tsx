import Layout from "pages/components/layout";
import ProductList from "pages/components/product-list";


export default function Sold(){
  return (
    <Layout title="슈퍼등록상품" canGoBack hasTabBar seoTitle="슈퍼등록상품">
      <ProductList kind="uploaded" />
    </Layout>
  );
}