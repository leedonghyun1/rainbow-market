import { Product } from "@prisma/client";
import { useRouter } from "next/router";
import Button from "pages/components/button";
import Input from "pages/components/input";
import Layout from "pages/components/layout";
import TextArea from "pages/components/textarea";
import useMutation from "pages/libs/client/useMutation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface UploadProductProps {
  name: string;
  price: number;
  description: string;
  link: string;
  photo?: FileList;
}

interface UploadProudctMutation {
  ok: boolean;
  product: Product;
}

export default function Upload() {
  const { register, handleSubmit } = useForm<UploadProductProps>();
  const route = useRouter();
  const [uploadProduct, { loading, data }] =
    useMutation<UploadProudctMutation>("/api/products/");
  const onValid = (data: UploadProductProps) => {
    if (loading) return;
    uploadProduct(data);
  };

  useEffect(() => {
    if (data?.ok) {
      route.push(`/products/${data.product.id}`);
    }
  }, [data, route]);
  return (
    <Layout canGoBack title="슈퍼 등록" seoTitle="슈퍼 등록" hasTabBar>
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <div>
          <label className="w-full mt-10 cursor-pointer text-gray-600 hover:border-purple-600 hover:text-purple-600 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
            <svg
              className="h-12 w-12"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input className="hidden" type="file" accept="image/*" />
          </label>
        </div>
        <Input
          register={register("name", { required: true })}
          required
          label="물품명"
          name="name"
          type="text"
          kind="text"
        ></Input>
        <Input
          register={register("price", { required: true })}
          required
          label="가격"
          name="price"
          kind="price"
          type="text"
        ></Input>
        <Input
          register={register("link", { required: true })}
          required
          label="상품구매링크"
          name="link"
          type="text"
          kind="text"
        ></Input>
        <TextArea
          register={register("description", { required: true })}
          required
          label="상품 설명"
          name="description"
        ></TextArea>
        <Button text={loading ? "등록중..." : "등록"}></Button>
      </form>
    </Layout>
  );
}
