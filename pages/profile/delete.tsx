import Image from "next/image";
import { useRouter } from "next/router";
import Button from "pages/components/button";
import Input from "pages/components/input";
import Layout from "pages/components/layout";
import useMutation from "pages/libs/client/useMutation";
import useUser from "pages/libs/client/useUser";
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
  const { user } = useUser();
  const {
    register,
    setValue,
    handleSubmit,
  } = useForm<EditProfileForm>();

  useEffect(() => {
    if (user?.name) setValue("name", user.name);
    if (user?.email) setValue("email", user.email);
    if (user?.phone) setValue("phone", user.phone);
  },[user, setValue]);
  // 유저 프로필 업데이트
  const [deleteProfile, { data, loading }] = useMutation("/api/users/me/delete");

  const onDelete = async () => {
    deleteProfile({});
  };

  return (
    <Layout canGoBack title="사장님 프로필" seoTitle="프로필 수정" hasTabBar>
      <form onSubmit={handleSubmit(onDelete)} className="py-14 px-4 space-y-4">
        <div className="flex items-center justify-center">
          {user?.image ? (
            <Image
              src={`https://imagedelivery.net/u7wvD59l3UZuCFJ8LR4Yaw/${user?.image}/avatar`}
              width={112}
              height={112}
              className="w-28 h-28 rounded-full"
              alt={""}
            />
          ):null}
        </div>
        <Input
          register={register("name")}
          required={false}
          label="닉네임"
          name="nickName"
          type="text"
          kind="text"
          disabled={true}
        />
        <Input
          register={register("email")}
          required={false}
          label="이메일 주소"
          name="email"
          type="email"
          kind="text"
          disabled={true}
        />
        <Input
          register={register("phone")}
          required={false}
          label="전화 번호"
          name="phone"
          type="text"
          kind="phone"
          disabled={true}
        />
        <Button text={loading ? "삭제 중..." : "계정 삭제"} />
      </form>
    </Layout>
  );
}