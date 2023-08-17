import Image from "next/image";
import { useRouter } from "next/router";
import Button from "components/button";
import Input from "components/input";
import Layout from "components/layout";
import useMutation from "libs/client/useMutation";
import useUser from "libs/client/useUser";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ProductUserInfoResponse } from "./[id]/sellerInfo";
import useSWR from "swr";
import cls from "@libs/client/utils";
import { notify } from "@libs/client/notify";
import Error from "next/error";

interface EditProfileForm {
  image?: FileList;
  name?: string;
  email?: string;
  phone?: string;
  formErrors?: string;
}

interface EditProfileResponse {
  ok: true;
  error:string;
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
    if (user) {
      if (user?.name) setValue("name", user.name);
      if (user?.email) setValue("email", user.email);
      if (user?.phone) setValue("phone", user.phone);
    }
  }, [user, setValue]);

  const [editProfile, { data, loading }] = useMutation<EditProfileResponse>("/api/users/me");

  const { data: userInfo } = useSWR("/api/users/me/info");

  const onValid = async ({ phone, name, image }: EditProfileForm) => {
    if (phone === "" && name === "") {
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

      if(data?.ok){
        notify("프로필 변경");
      }
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
        <div className="flex flex-row">
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
              className="cursor-pointer py-2 px-3 border hover:bg-purple-300 hover:text-white border-gray-300 rounded-md shadow-md text-sm font-medium focus:ring-offset-2 focus:ring-slate-300 text-gray-700 transition-colors"
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
          <div className="w-1/2 flex flex-row items-center ml-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="rgb(168 85 247)"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 text-purple-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
            <div className="ml-4 w-full rounded-full h-2.5 bg-gray-200">
              <div
                className={cls(
                  userInfo?.countSum
                    ? `bg-purple-400 h-2.5 rounded-full w-${userInfo.countSum}`
                    : null
                )}
              ></div>
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col space-y-3 text-sm text-slate-500 mt-6 w-1/2 pr-4 justify-center">
            <div className="flex">
              <div className="bg-gray-50 p-2 rounded-l-lg border border-gray-200 text-purple-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="rgb(168 85 247)"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
              <div className="bg-gray-50 rounded-r-lg border border-gray-200 w-full flex flex-row">
                <div className="self-center">
                  <span className="ml-2">좋아요</span>
                  <span className="ml-2">{userInfo?.favorites || 0} 회</span>
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="bg-gray-50 p-2 rounded-l-lg border border-gray-200 text-purple-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="rgb(168 85 247)"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </div>
              <div className="bg-gray-50 rounded-r-lg border border-gray-200 w-full flex flex-row">
                <div className="self-center">
                  <span className="ml-2">판매중</span>
                  <span className="ml-2">{userInfo?.sold || 0} 회</span>
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="bg-gray-50 p-2 rounded-l-lg border border-gray-200 text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="rgb(168 85 247)"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
              </div>
              <div className="bg-gray-50 rounded-r-lg border border-gray-200 w-full flex flex-row">
                <div className="self-center">
                  <span className="ml-2">판매완료</span>
                  <span className="ml-2">{userInfo?.compeletedSold || 0} 회 </span>
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="bg-gray-50 p-2 rounded-l-lg border border-gray-200 text-purple-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="rgb(168 85 247)"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z"
                  />
                </svg>
              </div>
              <div className="bg-gray-50 rounded-r-lg border border-gray-200 w-full flex flex-row">
                <div className="self-center">
                  <span className="ml-2">라이브 스트리밍</span>
                  <span className="ml-2">{userInfo?.stream || 0} 회</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4 w-1/2">
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
          </div>
        </div>
        {errors?.formErrors ? (
          <span className="my-2 text-red-500">{errors.formErrors.message}</span>
        ) : null}
        <Button text={loading ? "변경 중..." : "프로필 변경"} />
        <button
          onClick={() => {
            router.push("/profile/favs");
          }}
          className="w-full bg-purple-600 hover:bg-purple-900 text-white px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus: ring-red-900 focus:outline-none py-2 text-sm"
        >
          나의 관심상품
        </button>
        <button
          onClick={() => {
            router.push("/profile/delete");
          }}
          className="w-full bg-red-400 hover:bg-red-600 text-white px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus: ring-red-900 focus:outline-none py-2 text-sm"
        >
          계정 삭제
        </button>
      </form>
    </Layout>
  );
}
