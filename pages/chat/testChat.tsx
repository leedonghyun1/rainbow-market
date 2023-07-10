import { useEffect, useRef, useState } from "react";
import SocketIOClient from "socket.io-client";
import {io} from "socket.io-client";

let socket;

const TestChat = () => {

  const [ username, setUsername ] = useState("");
  const [ message, setMessage ] = useState("");
  const [ allMessages, setAllMessages ] = useState([] as any);

  useEffect(()=>{
    socketInitializer();
  },[]);

  async function socketInitializer(){
    await fetch("/api/chat/socketio")
    socket = io("http://localhost:3000",{transports:["websocket"]});
    //receive message
    socket.on("receive-message", (data) => {
      setAllMessages((pre) => [...pre, data]);
    });
  }

  //send message
  function handleSubmit(e){
    e.preventDefault();

    console.log("emitted");

    socket.emit("send-message",{
      username,
      message,
    })
    setMessage("");
  }

  return (
    <div>
      <h1>Chat App</h1>
      <p>Enter a Username</p>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border-black bg-gray-400"
      />

      { !!username && (
        <div>
          {allMessages.map(({ username, message}, index) => {
            <p key={index}>
              {username}:{message}
            </p>
          })}
          <form onSubmit={handleSubmit}>
            <p>Input a message</p>
            <input
              name="message"
              value={message}
              className="bg-gray-400"
              onChange={(e) => setMessage(e.target.value)}
            />
          </form>
        </div>
      )}
    </div>
  );
}

export default TestChat;