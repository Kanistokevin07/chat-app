import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    auth: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MzgwNzk2Yi04ZjQ3LTQzZjQtODIwYi0xMDlmMGQxNWZhNjYiLCJpYXQiOjE3ODUzMzgwOTEsImV4cCI6MTc4NTM0ODg5MX0.Tl7g4DvOSJM5ITGy7hm47td7vq5vK3fXvhD2THm94s0"
    }
});

socket.on("connect", () => {
    console.log("User C connected", socket.id);
});

socket.onAny((event, data) => {
    console.log("[C]", event, data);
});

const GROUP_ID = "GROUP_ID";

setTimeout(() => {

    socket.emit("join_conversation", GROUP_ID);

}, 1000);