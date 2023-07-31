import Image from "next/image";
import { useRouter } from "next/router";
import Button from "pages/components/button";
import Input from "pages/components/input";
import Layout from "pages/components/layout";
import useMutation from "libs/client/useMutation";
import useUser from "libs/client/useUser";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface EditProfileForm {
  image?: FileList;
  name?: string;
  email?: string;
  phone?: string;
  formErrors?: string;
}

export default function Edit() {
  // 유저 프로필 현재 상태 표시
  const router = useRouter();
  const { user } = useUser();
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<EditProfileForm>();

  useEffect(() => {
    if (user?.name) setValue("name", user.name);
    if (user?.email) setValue("email", user.email);
    if (user?.phone) setValue("phone", user.phone);
  },[user, setValue]);
  // 유저 프로필 업데이트
  const [editProfile, { data, loading }] = useMutation("/api/users/me");

  const onValid = async ({ phone, name, image }: EditProfileForm) => {
    if (phone === "" && name === "" ) {
      return setError("formErrors", {
        message: "업데이트 될 정보가 없습니다.",
      });
    }
    if (image && image.length > 0) {
      const { uploadURL } = await (await fetch("/api/imageFile")).json();
      
      const form = new FormData();
      form.append("file", image[0], user?.email);
      const {
        result: { id },
      } = await (await fetch(uploadURL, { method: "POST", body: form })).json();
   
      editProfile({ phone, name, imageId: id });
    } else {
      editProfile({ phone, name });
    }
  };

  const [imagePreview, setImagePreview] = useState("");
  const image = watch("image");

  useEffect(() => {
    if (image && image.length > 0) {
      //image는 fileList로 typescript 됨.
      const file = image[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [image]);

  useEffect(() => {
    if (data && !data.ok && data.error) {
      setError("formErrors", { message: data.error });
    }
  }, [data, setError]);
  return (
    <Layout canGoBack title="사장님 프로필" seoTitle="프로필 수정" hasTabBar>
      <form onSubmit={handleSubmit(onValid)} className="py-14 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          {imagePreview ? (
            <img
              src={imagePreview}
              className="w-14 h-14 rounded-full bg-slate-500"
            />
          ) : user?.image.startsWith("https") ? (
            <div className="w-14 h-14 rounded-full bg-slate-500" />
          ) : (
            <Image
              src={`https://imagedelivery.net/u7wvD59l3UZuCFJ8LR4Yaw/${user?.image}/avatar`}
              width={48}
              height={48}
              className="w-14 h-14 rounded-full"
              alt={""}
            />
          )}
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-slate-300 hover:text-white border-gray-300 rounded-md shadow-md text-sm font-medium focus:ring-offset-2 focus:ring-slate-300 text-gray-700"
          >
            프로필 변경
          </label>
          <input
            {...register("image")}
            id="picture"
            type="file"
            className="hidden"
            accept="image/*"
          />
        </div>
        <Input
          register={register("name")}
          required={false}
          label="닉네임"
          name="nickName"
          type="text"
          kind="text"
        />
        <Input
          register={register("email")}
          required={false}
          label="이메일 주소"
          name="email"
          type="email"
          kind="text"
        />
        <Input
          register={register("phone")}
          required={false}
          label="전화 번호"
          name="phone"
          type="text"
          kind="phone"
        />
        {errors?.formErrors ? (
          <span className="my-2 text-red-500">{errors.formErrors.message}</span>
        ) : null}
        <Button text={loading ? "변경 중..." : "프로필 변경"} />
        <button onClick={()=>{router.push("/profile/favs")}} className="w-full bg-purple-600 hover:bg-purple-900 text-white px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus: ring-red-900 focus:outline-none py-2 text-sm">나의 관심상품</button>
        <button onClick={()=>{router.push("/profile/delete")}} className="w-full bg-red-400 hover:bg-red-600 text-white px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus: ring-red-900 focus:outline-none py-2 text-sm">계정 삭제</button>
      </form>
    </Layout>
  );
}
