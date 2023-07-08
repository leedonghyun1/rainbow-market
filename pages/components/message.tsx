import cls from "pages/libs/client/utils";

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarId?: string;
}
export default function Message({message, reversed, avatarId}:MessageProps){
  return (
    <div
      className={cls(
        "flex items-center",
        reversed ? "flex-row-reverse space-x-reverse" : "space-x-2"
      )}
    >
      <div className="w-8 h-8 rounded-full bg-slate-400"></div>
      <div className="w-1/2 text-sm text-gray-700 p-2 border border-gray-300 rounded-md ml-3">
        <p>{message}</p>
      </div>
    </div>
  );
}