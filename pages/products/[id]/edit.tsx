import { Product } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "pages/components/button";
import Input from "pages/components/input";
import Layout from "pages/components/layout";
import TextArea from "pages/components/textarea";
import useMutation from "pages/libs/client/useMutation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ItemDeleteResponse } from ".";
import useSWR from "swr";

interface UploadProductProps {
  name?: string;
  price?: number;
  description?: string;
  link?: string;
  video?: FileList;
  formErrors?: string;
}

interface productResponse {
  ok: boolean;
  product: Product;
}

export default function Upload() {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<UploadProductProps>();

  let [videoPreview, setVideoPreview] = useState("");
  const video = watch("video");

  useEffect(() => {
    if (video && video.length > 0) {
      const file = video[0];
      setVideoPreview(URL.createObjectURL(file));
    }
  }, [video]);

  const [uploadProduct, { loading, data }] =
    useMutation<productResponse>("/api/products/");

  const [deletePost, { data: postDeleteData }] =
    useMutation<ItemDeleteResponse>(`/api/products/${router.query.id}`);

  const { data: productData } = useSWR<productResponse>(`/api/products/${router.query.id}`);

  const onValid = async ({
    name,
    price,
    description,
    link,
    video,
  }: UploadProductProps) => {
    if (loading) return;

    if (video && video.length > 0) {
      const form = new FormData();
      form.append("file", video[0]);

      try {
        deletePost({});
        const deleteVideoResponse = await (
          await fetch(`/api/video/${router.query.id}/deleteVideo`)
        ).json();
        try {
          const { uploadURL, uid } = await (
            await fetch("/api/video/videoFile")
          ).json();
          const uploadResult = await fetch(uploadURL, {
            method: "POST",
            body: form,
          });
          uploadProduct({ name, price, description, link, videoId: uid });
        } catch (error) {
          console.log("video change create error : ", error);
        }
      } catch (error) {
        console.log("video change delete error : ", error);
      }
    } else {
      uploadProduct({ name, price, description, link });
    }
  };

  useEffect(() => {
    if (data?.ok) {
      router.replace(`/products/${data.product.id}`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack title="슈퍼 수정" seoTitle="슈퍼 수정" hasTabBar>
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <div>
          {videoPreview ? (
            <>
              <iframe
                src={videoPreview}
                className="h-80 w-full rounded-md mt-10 cursor-pointer"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              ></iframe>
              <div className="mt-3 flex justify-end">
                <label>
                  <span className="bg-purple-400 text-sm rounded-xl px-5 py-2 text-white cursor-pointer hover:font-bold">
                    변경
                  </span>
                  <input
                    {...register("video")}
                    className="hidden w-5 bg-gray-400"
                    type="file"
                    accept="video/*"
                  />
                </label>
              </div>
            </>
          ) : (
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
              <input
                {...register("video")}
                className="hidden"
                type="file"
                accept="video/*"
              />
            </label>
          )}
        </div>
        <Input
          register={register("name")}
          required={false}
          label="물품명"
          name="name"
          type="text"
          kind="text"
          value={productData.product.name}
        ></Input>
        <Input
          register={register("price")}
          required={false}
          label="가격"
          name="price"
          kind="price"
          type="text"
          value={`${productData.product.price}`}
        ></Input>
        <Input
          register={register("link")}
          required={false}
          label="상품구매링크"
          name="link"
          type="text"
          kind="text"
          value={`${productData.product.link}`}
        ></Input>
        <TextArea
          register={register("description")}
          required={false}
          label="상품 설명"
          name="description"
          value={`${productData.product.description}`}
        ></TextArea>
        <Button text={loading ? "등록중..." : "등록"}></Button>
      </form>
    </Layout>
  );
}
