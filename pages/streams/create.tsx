import type { NextPage } from "next";
import React, { useEffect } from "react";
import Layout from "../components/layout";
import Button from "pages/components/button";
import TextArea from "pages/components/textarea";
import Input from "pages/components/input";
import { useForm } from "react-hook-form";
import useMutation from "pages/libs/client/useMutation";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";

interface CreateForm{
  name:string;
  price:string;
  description:string;
}
interface MyCreateStreamResponse{
  ok: boolean;
  stream : Stream
}

const Create: NextPage = () => {
  const [createStream, { loading, data }] = useMutation<MyCreateStreamResponse>(`/api/streams`);
  const { register, handleSubmit } = useForm<CreateForm>();
  const router = useRouter();
  const onValid = (form: CreateForm) => {
    if (loading) return;
    createStream(form);
  };
  useEffect(() => {
    if (data && data.ok) {
      router.push(`/streams/${data.stream.id}`);
    }
  }, [router, data]);
  return (
    <Layout canGoBack title="Go Live">
      <form  onSubmit={handleSubmit(onValid)} className=" space-y-4 py-10 px-4">
        <Input
          register={register("name", { required: true})}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("price", { required: true, valueAsNumber:true  })}
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
        />
        <Button text="Go live" />
      </form>
    </Layout>
  );
};

export default Create;
