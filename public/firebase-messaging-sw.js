// Import the functions you need from the SDKs you need
// service worker
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging-compat.js');

const config = {
  apiKey: "AIzaSyCQ5Ogcj7QavBv0DTseTT6aSMNgKOg1nJ4",
  authDomain: "rainbow-super.firebaseapp.com",
  projectId: "rainbow-super",
  storageBucket: "rainbow-super.appspot.com",
  messagingSenderId: "392209069253",
  appId: "1:392209069253:web:c0a8256ba2428344a12cac",
  measurementId: "G-89KNV1P0ML"
};

// Initialize Firebase
firebase.initializeApp(config);
const messaging = firebase.messaging();

self.addEventListener("push", function(event){
  console.log("event:", event.data)
  if(event.data){
    const data = event.data.json().data;
    const options = {
      name: data.name,
      message: data.message,
    };

    console.log("data:",data);

    event.waitUntil(
      self.registration.showNotification(options),
    )
  } else{
    console.log("This push event has no data.");
  }
})