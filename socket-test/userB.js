import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "./events.js";


const ACCESS_TOKEN =
"YOUR_USER_B_TOKEN";


const CONVERSATION_ID =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4YTA3NWFlOC0yMDRjLTRiYjgtYWI5YS0xNmE0YjdhNzkyMTQiLCJpYXQiOjE3ODUwODM4MTUsImV4cCI6MTc4NTA5NDYxNX0.ikgqVGSmAW0ad9_VvoIsAzENJ5P_Xy1h1EvIbtYAydo";


const socket = io(
    "http://localhost:5000",
    {
        auth:{
            token:ACCESS_TOKEN
        }
    }
);



socket.on("connect",()=>{

    console.log("✅ User B connected");
    console.log(socket.id);


    socket.emit(
        SOCKET_EVENTS.JOIN_CONVERSATION,
        CONVERSATION_ID
    );

});



socket.on(
    SOCKET_EVENTS.NEW_MESSAGE,
    (message)=>{

        console.log(
            "📩 User B received message"
        );

        console.log(message);

    }
);



socket.on(
    SOCKET_EVENTS.TYPING_START,
    (data)=>{

        console.log(
            "✍️ User B sees typing:",
            data
        );

    }
);



socket.on(
    SOCKET_EVENTS.TYPING_STOP,
    (data)=>{

        console.log(
            "🛑 User B sees stopped:",
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



socket.on(
    "connect_error",
    (err)=>{

        console.log(
            "Connection error:",
            err.message
        );

    }
);