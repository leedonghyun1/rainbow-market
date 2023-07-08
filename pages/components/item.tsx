
import Image from "next/image";
import Link from "next/link";


interface ItemProps {
  id: string;
  title: string;
  price: number;
  favorite: number;
  image:string;
}

export default function Item({ id, title, price, favorite, image }: ItemProps) {

  return (
    <Link
      href={`/products/${id}`}
      className="flex px-4 pt-1 cursor-pointer justify-between"
    >
      <div className="flex space-x-4">
        <img className="w-20 h-auto bg-gray-400 rounded-md" src={`https://customer-odn2bz8flwihe8yi.cloudflarestream.com/${image}/thumbnails/thumbnail.jpg?time=1s&height=48`}/>
        <div className="pt-2 flex flex-col">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <span className="font-medium mt-1 text-gray-900">{price} 원</span>
        </div>
      </div>
      <div className="flex items-end justify-end">
        <span className="text-xs text-gray-500">{favorite}</span>
      </div>
    </Link>
  );
}
