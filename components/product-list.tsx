import { Favorite, Product } from "@prisma/client";
import Item from "./item";
import useSWR from "swr";
import { ProductWithCount } from "pages";



interface Record {
  id:number;
  product:ProductWithCount;
}

interface ProductListResponse {
  [key:string]: Record[]
}

interface ProductListProps {
  kind: "sold" | "sell" | "favs";
}


export default function ProductList({kind}:ProductListProps){
  
  const { data } = useSWR<ProductListResponse>(`/api/users/me/${kind}`)

  console.log(data);

  return  (
    <>
      {data?.[kind]?.map((record) => (
        <Item
          id={record.product.id}
          key={record.product.id}
          title={record.product.name}
          price={record.product.price}
          favorite={record.product._count.favorites || 0}
          image={record.product.uploadVideo}
          sold={record.product.sold[0].saleIs}
          room={record.product._count.room || 0}
        />
      ))}
    </>
  )
}