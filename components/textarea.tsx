import {UseFormRegisterReturn} from "react-hook-form";

interface TextAreaProps{
  label: string;
  name: string;
  [key:string]:any;
  register?: UseFormRegisterReturn;
}

export default function TextArea({
  label,
  name,
  register,
  ...rest
}: TextAreaProps) {
  return (
    <div>
      {label ? (
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-gray-500"
        >
          {label}
        </label>
      ) : null}
      <textarea
        id={name}
        {...register}
        className="mt-1 shadow-sm w-full focus:ring-purple-600  focus:border-purple-600 hover:border-purple-600 rounded-md border-gray-500"
        rows={4}
        {...rest}
      />
    </div>
  );
}