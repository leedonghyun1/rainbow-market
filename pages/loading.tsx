import { NextPage } from "next";
import Layout from "../components/layout";

const Loading: NextPage = () => {
  return (
    <div>
      <div className="w-full h-96 bg-purple-500 items-center justify-items-center">
        <div className="self-center">
          <p className="text-2xl text-white font-bold justify-center items-center self-center">
            Rainbow Super
          </p>
        </div>
      </div>
    </div>
  );
}

export default Loading;