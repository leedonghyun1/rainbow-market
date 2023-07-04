import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  name: string;
  label: string;
  kind: "text" | "phone" | "price";
  register: UseFormRegisterReturn;
  required: boolean;
  type: string;
}
export default function Input({
  register,
  name,
  label,
  required,
  kind = "text",
  type,
}: InputProps) {
  return (
    <div>
      <label
        className="mb-1 block text-sm font-medium text-gray-500"
        htmlFor={name}
      >
        {label}
      </label>
      {kind === "text" ? (
        <div className="rounded-md relative flex items-center shadow-sm">
          <input
            id={name}
            required={required}
            {...register}
            type="type"
            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-600 focus:border-purple-600"
          />
        </div>
      ) : null}
      {kind === "price" ? (
        <div className="rounded-md relative flex items-center shadow-sm">
          <input
            id={name}
            {...register}
            required={required}
            type="type"
            className="appearance-none w-full px-3 pl-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-600 focus:border-purple-600"
          />
          <div className="absolute right-0 pointer-events-none pr-3 flex items-center">
            <span className="text-gray-500">KRW</span>
          </div>
        </div>
      ) : null}
      {kind === "phone" ? (
        <div className="flex rounded-md shadow-sm">
          <span className="flex items-center justify-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 select-none text-sm">
            +82
          </span>
          <input
            id={name}
            type="type"
            {...register}
            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md rounded-l-none shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      ) : null}
    </div>
  );
}
