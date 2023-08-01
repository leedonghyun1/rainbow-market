
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
  room: number;
}

export default function Item({ id, title, price, favorite, image, sold, room}: ItemProps) {
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
        <div
          className={cls(
            "flex items-end justify-between py-1 px-6 rounded-xl text-sm mr-3",
            sold === false ? "bg-slate-300" : "bg-purple-400"
          )}
        >
          {sold === false ? "판매중" : "판매완료"}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="3"
          stroke="currentColor"
          className="w-4 h-4 mr-1 text-purple-400"
        >
          <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>

        <span className="text-xs text-gray-500">{favorite}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="3"
          stroke="currentColor"
          className="w-4 h-4 ml-2 mr-1 text-purple-400"
        >
          <path d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
        </svg>
        <span className="text-xs text-gray-500">{room}</span>
      </div>
    </Link>
  );
}
