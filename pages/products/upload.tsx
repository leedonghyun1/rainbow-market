import { Product } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import products from "pages/api/products";
import Button from "pages/components/button";
import Input from "pages/components/input";
import Layout from "pages/components/layout";
import TextArea from "pages/components/textarea";
import useMutation from "pages/libs/client/useMutation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";

interface UploadProductForm {
  name:string;
  price:string;
  description:string;
  photo:FileList;
}

interface UploadProductMutation {
  ok:boolean;
  product:Product;
}

const Upload: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, watch } =  useForm<UploadProductForm>();
  const [uploadProduct, { loading, data }] =
    useMutation<UploadProductMutation>("/api/products");
  const onValid = async ({ name, price, description, photo }: UploadProductForm) => {
    if (loading) return;
    if( photo && photo.length > 0){
      //cloudflare get empty url
      const { uploadURL } = await(await fetch(`/api/files`)).json();
      const form = new FormData();
      //cloudflare upload image
      form.append("file", photo[0], name);
      const {
        result: { id },
      } = await(
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      uploadProduct({ name, price, description, photoId: id });
    } else{
      uploadProduct({ name, price, description });
    }

  };
  useEffect(() => {
    if (data?.ok) {
      router.push(`${data.product.id}`);
    }
  }, [data, router]);

  const photoWatch = watch("photo");
  const [ photoPreview, setPhotoPreview ] = useState(""); 

  useEffect(()=>{
    if(watch){
      if(photoWatch && photoWatch.length >0 ){
        const imageFile = photoWatch[0];
        setPhotoPreview(URL.createObjectURL(imageFile));
      }
    }
  },[photoWatch])

  return (
    <Layout canGoBack title="Upload Product" seoTitle="판매">
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <div>
          {photoPreview ? (
            <img
              src={photoPreview}
              className="w-full text-gray-600 border-2 border-gray-300 h-[350px] rounded-md"
            />
          ) : (
            <label className="w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
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
                  // strokeLinecap="round"
                  // strokeLinejoin="round"
                />
              </svg>
              <input
                {...register("photo")}
                className="hidden"
                type="file"
                accept="image/*"
              />
            </label>
          )}
        </div>
        <Input
          register={register("name", { required: true })}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("price", { required: true })}
          required
          label="Price"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", { required: true })}
          name="description"
          label="Description"
          required
        />
        <Button text={loading ? "loading..." : "Upload"} />
      </form>
    </Layout>
  );
};

export default Upload;
