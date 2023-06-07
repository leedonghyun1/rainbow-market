import type { NextPage } from "next";
import Button from "pages/components/button";
import Input from "pages/components/input";
import Layout from "pages/components/layout";
import useMutation from "pages/libs/client/useMutation";
import useUser from "pages/libs/client/useUser";
import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface EditProfileForm {
  email?: string;
  phone?: string;
  name?: string;
  avatar?: FileList;
  formErrors?: string;
}
interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<EditProfileForm>();

  useEffect(() => {
    if (user?.phone) setValue("phone", user.phone);
    if (user?.email) setValue("email", user.email);
    if (user?.name) setValue("name", user.name);
    if (user?.avatar) setAvatarPreview(`https://imagedelivery.net/u7wvD59l3UZuCFJ8LR4Yaw/${user.avatar}/public`);
  }, [user, setValue]);

  const [editProfile, { data, loading }] = useMutation(`/api/users/me`);

  const onValid = async ({ email, phone, name, avatar }: EditProfileForm) => {
    if (email === "" && phone === "" && name === "") {
      return setError("formErrors", { message: "Email or Phone is required." });
    }
    if (avatar && avatar.length > 0) {
      const { uploadURL } = await(await fetch(`/api/files`)).json();

      const form = new FormData();
      form.append("file", avatar[0], user?.email ? user.email : user?.phone);
      
     const {
       result: { id },
     } = await(
       await fetch(uploadURL, {
         method: "POST",
         body: form,
       })
     ).json();

      editProfile({
        email,
        phone,
        name,
        avatarId: id,
      });
    } else {
      editProfile({
        email,
        phone,
        name,
      });
    }
  };
  const [avatarPreview, setAvatarPreview] = useState("");
  const avatar = watch("avatar");
  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  },[avatar]);

  useEffect(() => {
    if (data && !data.ok && data.error) {
      setError("formErrors", { message: data.error });
    }
  }, [data, setError]);

  return (
    <Layout canGoBack title="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          {user?.avatar ? (
            <img
              src={avatarPreview}
              className="w-14 h-14 border-orange-300 border-2 rounded-full"
            />
          ) : (
            <div
              className="w-14 h-14 rounded-full bg-slate-500"
            />
          )}
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name")}
          required={false}
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("email")}
          required={false}
          label="Email address"
          name="email"
          type="email"
        />
        <Input
          register={register("phone")}
          required={false}
          label="Phone number"
          name="phone"
          type="text"
          kind="phone"
        />
        {errors?.formErrors ? (
          <span className="my-2 text-red-500">{errors.formErrors.message}</span>
        ) : null}
        <Button text={loading ? "Loading..." : "Update profile"} />
      </form>
    </Layout>
  );
};

export default EditProfile;
