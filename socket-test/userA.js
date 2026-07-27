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

    console.log("✅ User A connected");
    console.log(socket.id);


    socket.emit(
        SOCKET_EVENTS.JOIN_CONVERSATION,
        CONVERSATION_ID
    );


    setTimeout(()=>{

        console.log("✍️ User A typing...");


        socket.emit(
            SOCKET_EVENTS.TYPING_START,
            {
                conversationId:CONVERSATION_ID
            }
        );


    },3000);



    setTimeout(()=>{

        console.log("🛑 User A stopped typing");


        socket.emit(
            SOCKET_EVENTS.TYPING_STOP,
            {
                conversationId:CONVERSATION_ID
            }
        );


    },6000);



    setTimeout(()=>{

        console.log("Sending message");


        socket.emit(
            SOCKET_EVENTS.SEND_MESSAGE,
            {
                conversationId:CONVERSATION_ID,
                content:"Hello from User A"
            }
        );


    },8000);

});



socket.on(
    SOCKET_EVENTS.NEW_MESSAGE,
    (message)=>{

        console.log(
            "📩 User A received"
        );

        console.log(message);

    }
);


socket.on(
    SOCKET_EVENTS.TYPING_START,
    (data)=>{

        console.log(
            "Typing event received:",
            data
        );

    }
);


socket.on(
    SOCKET_EVENTS.TYPING_STOP,
    (data)=>{

        console.log(
            "Typing stop received:",
            data
        );

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