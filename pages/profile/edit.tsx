
import Button from "pages/components/button";
import Input from "pages/components/input";
import Layout from "pages/components/layout";
import { useForm } from "react-hook-form";

interface EditProfileForm{
  avatar?:FileList;
  nickName?:string;
  email?:string;
  phone?:string;
  formErrors?:string;
}

export default function Edit(){
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileForm>();
  return (
    <Layout canGoBack title="사장 프로필 수정" seoTitle="프로필 수정" hasTabBar>
      <form className="py-14 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full bg-purple-500"></div>
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-purple-400 hover:text-white border-gray-300 rounded-md shadow-md text-sm font-medium focus:ring-offset-2 focus:ring-purple-500 text-gray-700"
          >
            프로필 변경
          </label>
          <input
            {...register("avatar")}
            id="picture"
            type="file"
            className="hidden"
            accept="image/*"
          />
        </div>
        <Input register={register("nickName")} required={false} label="닉네임" name="nickName" type="text" kind="text"/>
        <Input register={register("email")} required={false} label="이메일 주소" name="email" type="email" kind="text" />
        <Input register={register("phone")} required={false} label="전화 번호" name="phone" type="text" kind="phone" />
        <Button text="프로필 변경" />
      
      </form>
    </Layout>
  );
}