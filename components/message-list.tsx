import cls from "libs/client/utils";

interface MessageProps {
  message: string;
  reversed?: boolean;
  image?: string;
  readOrNot?: boolean;
  loading?: boolean;
  status: boolean;
}
export default function MessageList({
  message,
  reversed,
  image,
  readOrNot,
  status = true,
}: MessageProps) {
  return (
    <div
      className={cls(
        "flex items-center",
        reversed
          ? "flex-row-reverse space-x-reverse gap-2 relative"
          : "space-x-2"
      )}
    >
      <img
        className="w-8 h-8 rounded-full bg-slate-400"
        src={`https://imagedelivery.net/u7wvD59l3UZuCFJ8LR4Yaw/${image}/avatar`}
      />
      <div className="w-1/2 text-sm text-gray-700 p-2 border border-gray-300 rounded-md ml-3">
        <p>{message}</p>
      </div>
      
      {status ?<>
        <div
          className={cls(
            "flex self-center",
            readOrNot === false || readOrNot === undefined
              ? "text-gray-500"
              : "text-purple-500"
          )}
        >
          {reversed ? (
            <div className="relative">
              <div
                className={cls("absolute", readOrNot ? " left-5" : "left-7")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          <span className="text-[9px] self-center mr-1">
            {reversed
              ? readOrNot === false || readOrNot === undefined
                ? "안읽음"
                : "읽음"
              : ""}
          </span>
        </div>
      </>:null}
    </div>
  );
}
