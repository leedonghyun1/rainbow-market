import { Product } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "components/button";
import Input from "components/input";
import Layout from "components/layout";
import TextArea from "components/textarea";
import useMutation from "libs/client/useMutation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface UploadProductProps {
  name: string;
  price: number;
  description: string;
  link: string;
  video?: FileList;
  formErrors?: string;
}

interface UploadProudctMutation {
  ok: boolean;
  product: Product;
}

export default function Upload() {

  const { register, handleSubmit, watch } = useForm<UploadProductProps>();
  const router = useRouter();

  const [ videoPreview, setVideoPreview ] = useState("");
  const video = watch("video");

  useEffect(()=>{
    if(video && video.length>0){
      const file = video[0]
      setVideoPreview(URL.createObjectURL(file));
    }
  },[video])

 const [uploadProduct, { loading, data }] =
    useMutation<UploadProudctMutation>("/api/products/");
  const onValid = async ({
    name,
    price,
    description,
    link,
    video
  }: UploadProductProps) => {
    if (loading) return;
    //upload video
    if (video && video.length > 0) {
      const { uploadURL, uid } = await (await fetch("/api/video/videoFile")).json();

      const form = new FormData();
      form.append("file", video[0]);

      //video upload and response check
      const uploadResult = await fetch(uploadURL, {
        method: "POST",
        body: form,
      });

      uploadProduct({ name, price, description, link, videoId: uid });
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
    <Layout canGoBack title="슈퍼 등록" seoTitle="슈퍼 등록" hasTabBar>
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <div>
          {videoPreview ? (
            <video
              src={videoPreview}
              className="w-full mt-10 h-auto rounded-md"
            />
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
