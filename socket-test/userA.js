import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "./events.js";

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWNiZTVhYS1hYzUwLTRhMjgtYTE4NC1iODBmZTc1MmFkMTkiLCJpYXQiOjE3ODQ5MTIzNjYsImV4cCI6MTc4NDkxMzI2Nn0.a9AnEVitiwd_Ja0GZAdrKNPn730AfrFpenttShATBjQ";

const CONVERSATION_ID =
    "f79b641f-f01e-4641-b19b-fa347d344039";

const socket = io("http://localhost:5000", {
    auth: {
        token: ACCESS_TOKEN
    }
});

socket.on("connect", () => {

    console.log("✅ User A connected");
    console.log(socket.id);

    socket.emit(
        SOCKET_EVENTS.JOIN_CONVERSATION,
        CONVERSATION_ID
    );

    setTimeout(() => {

        socket.emit(
            SOCKET_EVENTS.SEND_MESSAGE,
            {
                conversationId: CONVERSATION_ID,
                content: "Hello from User A 22222"
            }
        );

    }, 3000);

});

socket.on(
    SOCKET_EVENTS.NEW_MESSAGE,
    (message) => {

        console.log("\n📩 User A received");
        console.log(message);

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