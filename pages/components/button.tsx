import cls from "../libs/client/utils";

interface ButtonProps {
  large?: boolean;
  text: string;

  [key: string]: any;
}

export default function Button({
  large = false,
  onClick,
  text,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cls(
        "w-full bg-purple-600 hover:bg-purple-900 text-white px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus: ring-purple-900 focus:outline-none",
        large ? "py-3 text-base" : "py-2 text-sm"
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
