import { Post } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Button from "pages/components/button";
import Layout from "pages/components/layout";
import TextArea from "pages/components/textarea";
import useCoords from "pages/libs/client/useCoords";
import useMutation from "pages/libs/client/useMutation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

interface WriteForm{
  question:string
} 

interface WriteRespone {
  ok:boolean;
  post: Post;
}

const Write: NextPage = () => {
  const { latitude, longitude } = useCoords();
  const router = useRouter();
  const { register, handleSubmit } = useForm<WriteForm>();
  const [ post, {loading, data}] = useMutation<WriteRespone>("/api/posts");
  const onValid = (data:WriteForm) =>{
    if(loading) return;
    post({...data, latitude, longitude});
  }
  useEffect(()=>{
    if(data && data.ok){
      router.push(`/community/${data.post.id}`);
    }
  },[data, router]);
  return (
    <Layout canGoBack title="Write Post">
      <form onSubmit={handleSubmit(onValid)} className="p-4 space-y-4">
        <TextArea
          register={register("question", { required: true, minLength: 5 })}
          required
          placeholder="Ask a question!"
        />
        <Button text={loading ? "Loading..." : " Submit "} />
      </form>
    </Layout>
  );
};

export default Write;