import cls from "libs/client/utils";

interface MessageProps {
  message: string;
  reversed?: boolean;
  image?:string;
}
export default function Message({message, reversed, image}:MessageProps){
  return (
    <div
      className={cls(
        "flex items-center",
        reversed ? "flex-row-reverse space-x-reverse gap-2" : "space-x-2"
      )}
    >
      <img className="w-8 h-8 rounded-full bg-slate-400" src={`https://imagedelivery.net/u7wvD59l3UZuCFJ8LR4Yaw/${image}/avatar`} />
      <div className="w-1/2 text-sm text-gray-700 p-2 border border-gray-300 rounded-md ml-3">
        <p>{message}</p>
      </div>
    </div>
  );
}