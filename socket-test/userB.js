import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    auth: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWNiZTVhYS1hYzUwLTRhMjgtYTE4NC1iODBmZTc1MmFkMTkiLCJpYXQiOjE3ODUyNTM5NjksImV4cCI6MTc4NTI2NDc2OX0.KNITjcT4D6fadQF2W86F8zgWNkx5H_HgeXz6ehVjbNA"
    }
});

socket.on("connect", () => {
    console.log("User B connected", socket.id);
});

socket.onAny((event, data) => {
    console.log("[B]", event, data);
});

const GROUP_ID = "GROUP_ID";

setTimeout(() => {

    socket.emit("join_conversation", GROUP_ID);

}, 1000);

// Leave group
/*
setTimeout(() => {
    socket.emit("group_member_left", {
        conversationId: GROUP_ID
    });
}, 5000);
*/