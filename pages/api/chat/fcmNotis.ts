import {getMessaging} from "firebase-admin/messaging";
import { env } from "process";
import { ServiceAccount } from "firebase-admin";

interface NotificationData {
  userid:string,
  username:string,
  message:string,
}

const admin = require("firebase-admin");

export const sendFCMNotification = async (username, message, fcmToken) =>{

  const { NEXT_PUBLIC_FIREBASE_PRIVATE_KEY, NEXT_PUBLIC_CLIENT_EMAIL, NEXT_PUBLIC_PROJECT_ID } = env;
  const serviceAccount:ServiceAccount = {
    projectId: NEXT_PUBLIC_PROJECT_ID,
    privateKey: NEXT_PUBLIC_FIREBASE_PRIVATE_KEY,
    clientEmail: NEXT_PUBLIC_CLIENT_EMAIL,
  }

  if(!admin.apps.length){
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  }

  const chatMessage = {
    data:{
      name: username,
      message: message,
    },
    token:fcmToken,
  }
  
  getMessaging().send(chatMessage).then((response)=>{
    console.log("successfully sent : ", response);
  }).catch((error)=>{
    console.log("sending error : ", error);
  })
}