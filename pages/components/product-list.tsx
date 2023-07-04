import Item from "./item";

interface ProductListProps {
  kind: "uploaded" | "favs";
}

export default function ProductList({kind}:ProductListProps){
  return (
    <>
      <div className="mt-16">
        <Item
          id={12}
          title={"마우스판매"}
          price={20000}
          username={"이동현"}
        ></Item>
      </div>
    </>
  );
}