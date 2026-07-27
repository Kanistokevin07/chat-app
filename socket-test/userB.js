import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "./events.js";


const ACCESS_TOKEN =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4YTA3NWFlOC0yMDRjLTRiYjgtYWI5YS0xNmE0YjdhNzkyMTQiLCJpYXQiOjE3ODUxNTk2NTMsImV4cCI6MTc4NTE3MDQ1M30.knHARKtXZ_JPysz493muiVXScrexD_ArhWqax63Qz5k";


const CONVERSATION_ID =
"f79b641f-f01e-4641-b19b-fa347d344039";



const socket = io(
"http://localhost:5000",
{
    auth:{
        token:ACCESS_TOKEN
    },
    reconnection:false
});




socket.on(
"connect",
()=>{


console.log(
"USER B CONNECTED",
socket.id
);



setTimeout(()=>{

        console.log(
            "USER B JOINING ROOM"
        );


        socket.emit(
            SOCKET_EVENTS.JOIN_CONVERSATION,
            CONVERSATION_ID
        );


    },1000);


});





socket.on(
SOCKET_EVENTS.NEW_MESSAGE,
(message)=>{


console.log(
"\nB NEW MESSAGE"
);


console.log(message);


});





socket.on(
SOCKET_EVENTS.MESSAGE_EDITED,
(message)=>{


console.log(
"\nB MESSAGE EDITED"
);


console.log(message);


});





socket.on(
SOCKET_EVENTS.MESSAGE_DELETED,
(message)=>{


console.log(
"\nB MESSAGE DELETED"
);


console.log(message);


});





socket.on(
SOCKET_EVENTS.TYPING_START,
(data)=>{


console.log(
"\nB TYPING START"
);


console.log(data);


});





socket.on(
SOCKET_EVENTS.TYPING_STOP,
(data)=>{


console.log(
"\nB TYPING STOP"
);


console.log(data);


});





socket.on(
"connect_error",
err=>{

console.log(
err.message
);

});