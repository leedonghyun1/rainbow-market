import { Product, Sold } from "@prisma/client";
import Item from "../components/item";
import Layout from "../components/layout";
import { NextPage } from "next";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import useMutation from "../libs/client/useMutation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FloatingButton from "@components/floating-button";
import { useFormatter } from "next-intl";
import { initializeApp } from 'firebase/app'
import { getMessaging, onMessage, getToken } from 'firebase/messaging'
import { onBackgroundMessage } from "firebase/messaging/sw";


export interface ProductWithCount extends Product {
  _count: {
    favorites: number;
    room:number;
  };
  sold:Sold[];
  updatedAt:Date;
}

interface ProductReponse {
  ok: Boolean;
  products: ProductWithCount[];
}
interface loginMutation {
  ok: Boolean;
}


const Home: NextPage = () => {
  const { data } = useSWR<ProductReponse>("/api/products");
  
  const { data: session } = useSession();
  const { data: notificationUpdate } = useSWR("/api/users/me/notification");
  const { data: updateStar} = useSWR("/api/users/me/info");
  const { register, handleSubmit, watch, reset } = useForm();
  const [login, { loading, data: tokenData, error }] =
    useMutation<loginMutation>("/api/users/token");
  const [
    search,
    { data: searchData, loading: searchLoading, error: searchError },
  ] = useMutation<ProductReponse>("/api/search");

  const [ createFcmToken ] = useMutation("/api/users/me/fcmToken");

  const [beforeSearch, afterSearch] = useState(false);



  const onMessageFCM = async()=>{
    const permission = await Notification.requestPermission();
    if(permission === "granted") {
      const firebaseApp = initializeApp({
        apiKey: "AIzaSyCQ5Ogcj7QavBv0DTseTT6aSMNgKOg1nJ4",
        authDomain: "rainbow-super.firebaseapp.com",
        projectId: "rainbow-super",
        storageBucket: "rainbow-super.appspot.com",
        messagingSenderId: "392209069253",
        appId: "1:392209069253:web:c0a8256ba2428344a12cac",
        measurementId: "G-89KNV1P0ML"
      })
  
      const messaging = getMessaging(firebaseApp);
  
      getToken(messaging, { vapidKey: "BFMfY0YsM5d25VKBkpAKEbcUeIXllR0QHUg8mlDw6DXqgsrWbtTiqyUIqAFwwPxyHYoNpa-0qgqT03-j-EsMw6o" }).then((currentToken) => {
        if (currentToken) {
          // 정상적으로 토큰이 발급되면 콘솔에 출력합니다.
          // currentToken을 db에 개인에게 저장 후 나중에 notifications을 보낼 때 이용 필요.
          console.log(currentToken);

          createFcmToken({ currentToken });
          
        } else {
          console.log('No registration token available. Request permission to generate one.')
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err)
      })
   
      // 메세지가 수신되면 역시 콘솔에 출력합니다.
      
      onMessage(messaging, (payload) => {
        console.log('Message received. ', payload)
      });
    } else{
      console.log("알림 허용이 되어 있지 않습니다.");
    }
  }

  useEffect(() => {
    onMessageFCM();
    if (session) {
      login(session);
    }
  }, []);

  const searchItem = (item) => {
    search(item);
    reset();
    afterSearch(true);
  }

  const format = useFormatter();

  const calTime =(time)=>{
    const dateTime = new Date(time);
    const now = new Date(Date.now());
    const result = format.relativeTime(dateTime, now);
    return result;
  }

  return (
    <div>
      
      <Layout
        seoTitle="슈퍼"
        hasTabBar
        canGoBack
        title="슈퍼"
        notificationNum={notificationUpdate?.unreadMsgCount}
      >
        <form onSubmit={handleSubmit(searchItem)}>
          <div className="flex flex-col space-y-5  py-10">
            <input
              {...register("find")}
              placeholder="슈퍼 검색"
              type="text"
              className="w-2/3 h-9 rounded-2xl self-center hover:outline-purple-400 placeholder-slate-400 transition-all"
            />

            {beforeSearch === false
              ? data?.products?.map((product) => (
                  <Item
                    id={product.id}
                    title={product.name}
                    price={product.price}
                    favorite={product._count?.favorites || 0}
                    key={product.id}
                    image={product.uploadVideo}
                    sold={product.sold[0].saleIs}
                    room={product._count?.room || 0}
                    time={calTime(product.updatedAt)}
                  />
                ))
              : searchData
              ? searchData?.products?.map((product) => (
                  <Item
                    id={product.id}
                    title={product.name}
                    price={product.price}
                    favorite={product._count?.favorites || 0}
                    key={product.id}
                    image={product.uploadVideo}
                    sold={product.sold[0].saleIs}
                    room={product._count?.room || 0}
                  />
                ))
              : data?.products?.map((product) => (
                  <Item
                    id={product.id}
                    title={product.name}
                    price={product.price}
                    favorite={product._count?.favorites || 0}
                    key={product.id}
                    image={product.uploadVideo}
                    sold={product.sold[0].saleIs}
                    room={product._count?.room || 0}
                  />
                ))}
          </div>
        </form>
        <FloatingButton href="/products/upload">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </FloatingButton>
      </Layout>
    </div>
  );
};

export default Home;
