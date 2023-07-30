import { Favorite, Product } from "@prisma/client";
import Item from "./item";
import useSWR from "swr";

interface ProductListProps {
  kind: "uploaded" | "favs" | "sold";
}

interface ProdcutWithFavsCount extends Product{
  _count: number;
}

interface FavsWithProduct extends Favorite{
  product: ProdcutWithFavsCount;
}

interface UserReponse {
  ok: Boolean;
  favorites: FavsWithProduct[];
}

export default function ProductList({kind}:ProductListProps){
  
  const { data:favsProducts } = useSWR<UserReponse>(`/api/users/me/${kind}`)

  console.log(favsProducts)

  return (
    <>
      {kind === "favs" ? favsProducts?.favorites.map((favorites) => {
        <div className="mt-16">
          <Item
            id={favorites.product.id}
            key={favorites.product.id}
            title={favorites.product.name}
            price={favorites.product.price}
            favorite={favorites.product._count || 0 }
            image={favorites.product.uploadVideo}
          />
        </div>;
      }):null}
    </>
  );
}