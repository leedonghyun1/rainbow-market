
import cls from "@libs/client/utils";
import Image from "next/image";
import Link from "next/link";


interface ItemProps {
  id: string;
  title: string;
  price: number;
  favorite: number;
  image: string;
  sold: boolean;
}

export default function Item({ id, title, price, favorite, image, sold}: ItemProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="flex px-4 pt-1 cursor-pointer justify-between"
    >
      <div className="flex space-x-4">
        <img
          className="w-20 h-auto bg-gray-400 rounded-md shadow-md"
          src={`https://customer-odn2bz8flwihe8yi.cloudflarestream.com/${image}/thumbnails/thumbnail.jpg?time=1s&height=48`}
        />
        <div className="pt-2 flex flex-col">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <span className="font-medium mt-1 text-gray-900">{price} 원</span>
        </div>
      </div>
      <div className="flex items-end justify-end">
        <div className={cls("flex items-end justify-between py-1 px-6 rounded-xl text-sm mr-3", sold === false ? "bg-slate-300":"bg-purple-400")}>
          { sold === false ? "판매중" : "판매완료"}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
          className="mr-1 w-4 h-4"
        >
          <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
        </svg>
        <span className="text-xs text-gray-500">{favorite}</span>
      </div>
    </Link>
  );
}
