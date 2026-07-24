import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "./events.js";

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4YTA3NWFlOC0yMDRjLTRiYjgtYWI5YS0xNmE0YjdhNzkyMTQiLCJpYXQiOjE3ODQ5MTIzNDAsImV4cCI6MTc4NDkxMzI0MH0.Z6bH-80DsskUKp-0JGO4U72YogJxfSZZunhs9IE_Cs0";

const CONVERSATION_ID =
    "f79b641f-f01e-4641-b19b-fa347d344039";

const socket = io("http://localhost:5000", {
    auth: {
        token: ACCESS_TOKEN
    }
});

socket.on("connect", () => {

    console.log("✅ User B connected");
    console.log(socket.id);

    socket.emit(
        SOCKET_EVENTS.JOIN_CONVERSATION,
        CONVERSATION_ID
    );

});

socket.on(
    SOCKET_EVENTS.NEW_MESSAGE,
    (message) => {

        console.log("\n📩 User B received");
        console.log(message);

        socket.emit(
            SOCKET_EVENTS.MESSAGE_DELIVERED,
            {
                messageId: message.id,
                conversationId: CONVERSATION_ID
            }
        );

        setTimeout(() => {

            socket.emit(
                SOCKET_EVENTS.MESSAGE_READ,
                {
                    messageId: message.id,
                    conversationId: CONVERSATION_ID
                }
            );

        }, 3000);

    }
);

socket.on(
    SOCKET_EVENTS.MESSAGE_STATUS_UPDATED,
    (data) => {

        console.log("\n✅ Status Updated");
        console.log(data);

    }
);

socket.on("disconnect", () => {
    console.log("Disconnected");
});