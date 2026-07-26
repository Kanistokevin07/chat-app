import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "./events.js";


const ACCESS_TOKEN =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWNiZTVhYS1hYzUwLTRhMjgtYTE4NC1iODBmZTc1MmFkMTkiLCJpYXQiOjE3ODUwNzk5ODksImV4cCI6MTc4NTA5MDc4OX0.4wvAvZ1MPhVba2cnDNSENRilnuoKUUMxQMoIFdXRKpY";


const CONVERSATION_ID =
"f79b641f-f01e-4641-b19b-fa347d344039";


const socket = io(
    "http://localhost:5000",
    {
        auth:{
            token:ACCESS_TOKEN
        }
    }
);


socket.on("connect",()=>{

    console.log(
        "✅ User A connected"
    );


    socket.emit(
        SOCKET_EVENTS.JOIN_CONVERSATION,
        CONVERSATION_ID
    );


    setTimeout(()=>{


        console.log(
            "Sending message 1"
        );


        socket.emit(
            SOCKET_EVENTS.SEND_MESSAGE,
            {
                conversationId:CONVERSATION_ID,
                content:"Offline test message 1"
            }
        );


    },3000);



    setTimeout(()=>{


        console.log(
            "Sending message 2"
        );


        socket.emit(
            SOCKET_EVENTS.SEND_MESSAGE,
            {
                conversationId:CONVERSATION_ID,
                content:"Offline test message 2"
            }
        );


    },6000);

    socket.on(
        SOCKET_EVENTS.NEW_MESSAGE,
        (message)=>{

            console.log(
                "📩 New message"
            );

            console.log(message);

        }
    );



    socket.on(
        SOCKET_EVENTS.USER_ONLINE,
        (data)=>{
            console.log(
                "ONLINE:",
                data
            );
        }
    );


    socket.on(
        SOCKET_EVENTS.USER_OFFLINE,
        (data)=>{
            console.log(
                "OFFLINE:",
                data
            );
        }
    );


});


