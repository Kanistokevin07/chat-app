import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "./events.js";


const ACCESS_TOKEN =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4YTA3NWFlOC0yMDRjLTRiYjgtYWI5YS0xNmE0YjdhNzkyMTQiLCJpYXQiOjE3ODQ5OTQxNjEsImV4cCI6MTc4NDk5NTk2MX0.OCOc1CxVYXrCxLWrW-afrJg1f_rHyig_cBgmvdjR1So";


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
        "✅ User B connected"
    );


    socket.emit(
        SOCKET_EVENTS.JOIN_CONVERSATION,
        CONVERSATION_ID
    );

});



socket.on(
    SOCKET_EVENTS.NEW_MESSAGE,
    (message)=>{

        console.log(
            "📩 User B received"
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