import { Product, User } from "@prisma/client";
import { useRouter } from "next/router";
import Layout from "pages/components/layout";
import useSWR from "swr";

interface ProductWitheUser extends Product {
  user: User;
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWitheUser;
}

export default function ItemDetails() {
  const router = useRouter();
  const { data } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );

  return (
    <Layout canGoBack seoTitle="상품상세" hasTabBar title="슈퍼">
      {data ? (
        <div className="px-4 py-10">
          <div className="mb-8">
            <div className="relative">
              <div className="h-96 w-full bg-gray-600 rounded-lg" />
            </div>
          </div>
          <div className="flex justify-between items-center relative">
            <div className="cursor-pointer py-3 border-t border-b space-x-3 w-12 h-12 rounded-full bg-gray-600"></div>
            <div className="text-sm text-gray-700 absolute left-14">
              <p>이동현 님의 프로필</p>
            </div>
            <div className="text-sm font-semibold text-orange-500 flex flex-col items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 640 512"
              >
                <path d="M320 96C178.6 96 64 210.6 64 352v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352C0 175.3 143.3 32 320 32s320 143.3 320 320v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352C576 210.6 461.4 96 320 96zm0 192c-35.3 0-64 28.7-64 64v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352c0-70.7 57.3-128 128-128s128 57.3 128 128v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352c0-35.3-28.7-64-64-64zM160 352v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352c0-123.7 100.3-224 224-224s224 100.3 224 224v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V352c0-88.4-71.6-160-160-160s-160 71.6-160 160z" />
              </svg>
              <p>주황 등급</p>
            </div>
          </div>
          <div className="mt-8 mb-8 relative">
            <div className="flex items-center justify-between ">
              <div className="text-lg text-gray-600 font-semibold pl-2">
                <span>{data?.product?.name}</span>
              </div>
              <div className="text-gray-700 font-semibold text-lg">
                <span>{data?.product?.price}</span>
                <span>₩</span>
              </div>
            </div>
            <div>
              {/* image 처리 필요 */}
              <span className="left-10">{data?.product?.link}</span>
            </div>
          </div>
          <div>
            <div className="px-2 flex flex-col">
              <span className="text-lg text-gray-700 font-semibold mb-3">
                슈퍼설명
              </span>
              <span>{data?.product?.description}</span>
            </div>
          </div>
        </div>
      ) : null}
    </Layout>
  );
}
