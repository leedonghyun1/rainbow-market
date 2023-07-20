import { Server } from "socket.io";
import client from "pages/libs/server/client";

const SocketHandler = (_, res) => {
  const io = new Server(res.socket.server,{
      cors: {
          origin: "http://localhost:3000",
          methods: ["GET", "POST"],
          credentials: true,
      }
  });
  const roomName = Math.floor(10000 + Math.random() * 900000) + "";
  io.use((socket, next)=>{
    try{
      console.log("middleware is running");
      socket.data.age=25;
      next();
    }catch(error){
      console.error("error : ", error);
      next(new Error("socket.io middleware error"));
    }
  })
  io.on("connect", (socket) => {
    socket.on("enter_room", async (routerId, userId, data) => {
      const roomCheck = await client.room.findFirst({
        where: {
          userId: userId + "",
          productId: routerId + "",
        },
      });
      // room 생성 및 존재하면 생성x
      if (!roomCheck) {
        const roomCreate = await client.room.create({
          data: {
            name: roomName,
            user: {
              connect: {
                email: data.product.user.email,
              },
            },
            product: {
              connect: {
                id: data.product.id,
              },
            },
          },
        });
      }
    });
    socket.on("new_message", async (routerId, userEmail, data, message) => {
      
      const roomCheck = await client.room.findFirst({
        where: {
          productId: routerId + "",
        },
      });
      const newMessage = await client.message.create({
        data: {
          message: message.message,
          user: {
            connect: {
              email: userEmail,
            },
          },
          product: {
            connect: {
              id: data.product.id,
            },
          },
          room: {
            connect: {
              id: roomCheck.id,
            },
          },
        },
      });
      const updateMessage = await client.room.update({
        where : {
          id: newMessage.roomId
        },
        data:{
          lastChat : newMessage.message,
          timeOfLastChat : new Date(),
        }
      })
      socket.emit("receive_message");
    });
  });
  res.end();
};

export default SocketHandler;
