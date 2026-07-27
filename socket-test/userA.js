import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "./events.js";


const USER_ID = "facbe5aa-ac50-4a28-a184-b80fe752ad19";

const ACCESS_TOKEN =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWNiZTVhYS1hYzUwLTRhMjgtYTE4NC1iODBmZTc1MmFkMTkiLCJpYXQiOjE3ODUxNTk2ODksImV4cCI6MTc4NTE3MDQ4OX0.8j8Cs3U_FLn142dUcwfRmwPnfSf-8vi61WNoVjEAi5c";


const CONVERSATION_ID =
"f79b641f-f01e-4641-b19b-fa347d344039";


const socket = io(
    "http://localhost:5000",
    {
        auth:{
            token: ACCESS_TOKEN
        },
        reconnection:false
    }
);


let messageId = null;


socket.on("connect",()=>{

    console.log(
        "USER A CONNECTED",
        socket.id
    );

 setTimeout(()=>{

        console.log(
            "USER A JOINING ROOM"
        );


        socket.emit(
            SOCKET_EVENTS.JOIN_CONVERSATION,
            CONVERSATION_ID
        );


    },1000);


    // typing start

    setTimeout(()=>{

        console.log("A typing...");

        socket.emit(
            SOCKET_EVENTS.TYPING_START,
            {
                conversationId:CONVERSATION_ID
            }
        );

    },2000);



    // typing stop

    setTimeout(()=>{

        console.log("A stopped typing");

        socket.emit(
            SOCKET_EVENTS.TYPING_STOP,
            {
                conversationId:CONVERSATION_ID
            }
        );

    },4000);



    // send message

    setTimeout(()=>{


        console.log(
            "A sending message"
        );


        socket.emit(
            SOCKET_EVENTS.SEND_MESSAGE,
            {
                conversationId:CONVERSATION_ID,
                content:"Hello from User A"
            }
        );


    },6000);



});




// receive created message

socket.on(
SOCKET_EVENTS.NEW_MESSAGE,
(message)=>{


    console.log(
        "\nA RECEIVED MESSAGE"
    );

    console.log(message);



    if(message.senderId === USER_ID){

        messageId = message.id;


        console.log(
            "SAVED MESSAGE ID",
            messageId
        );


        // EDIT

        setTimeout(()=>{


            console.log(
                "\nA EDITING MESSAGE"
            );


            socket.emit(
                SOCKET_EVENTS.MESSAGE_EDITED,
                {
                    messageId,
                    conversationId:CONVERSATION_ID,
                    content:
                    "Hello edited by User A"
                }
            );


        },3000);



        // DELETE


        setTimeout(()=>{


            console.log(
                "\nA DELETING MESSAGE"
            );


            socket.emit(
                SOCKET_EVENTS.MESSAGE_DELETED,
                {
                    messageId,
                    conversationId:CONVERSATION_ID
                }
            );


        },6000);



    }


});





socket.on(
SOCKET_EVENTS.MESSAGE_EDITED,
(message)=>{


    console.log(
        "\nA GOT EDIT EVENT"
    );

    console.log(message);

});




socket.on(
SOCKET_EVENTS.MESSAGE_DELETED,
(message)=>{


    console.log(
        "\nA GOT DELETE EVENT"
    );

    console.log(message);

});



socket.on(
"connect_error",
err=>{

console.log(
"ERROR",
err.message
);

});