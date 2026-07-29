import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    auth: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWNiZTVhYS1hYzUwLTRhMjgtYTE4NC1iODBmZTc1MmFkMTkiLCJpYXQiOjE3ODUzMzgwNDYsImV4cCI6MTc4NTM0ODg0Nn0.QwHx20jSybelyYsYbH3-0nKN_9M0ltKQhY73OUuoL3k"
    }
});

socket.on("connect", () => {
    console.log("User A connected", socket.id);
});

socket.onAny((event, data) => {
    console.log("[A]", event, data);
});

// Replace with your group id
const GROUP_ID = "0b8682d1-5031-4f84-ae6c-7dea19eb3e26";

// Replace with User B id
const USER_B = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4YTA3NWFlOC0yMDRjLTRiYjgtYWI5YS0xNmE0YjdhNzkyMTQiLCJpYXQiOjE3ODUzMzgwNzYsImV4cCI6MTc4NTM0ODg3Nn0.44dOKKTsD_QlGKmiscUUYZeg5YnldJPJzR57kYP8GQE";

// Replace with User C id
const USER_C = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MzgwNzk2Yi04ZjQ3LTQzZjQtODIwYi0xMDlmMGQxNWZhNjYiLCJpYXQiOjE3ODUzMzgwOTEsImV4cCI6MTc4NTM0ODg5MX0.Tl7g4DvOSJM5ITGy7hm47td7vq5vK3fXvhD2THm94s0";

setTimeout(() => {

    socket.emit("join_conversation", GROUP_ID);

}, 1000);

// Uncomment one at a time

// Add User C
/*
setTimeout(() => {
    socket.emit("group_member_added", {
        conversationId: GROUP_ID,
        userId: USER_C
    });
}, 3000);
*/

// Remove User B
/*
setTimeout(() => {
    socket.emit("group_member_removed", {
        conversationId: GROUP_ID,
        userId: USER_B
    });
}, 5000);
*/

// Promote User B
/*
setTimeout(() => {
    socket.emit("group_role_updated", {
        conversationId: GROUP_ID,
        userId: USER_B,
        role: "ADMIN"
    });
}, 7000);
*/

// Demote User B
/*
setTimeout(() => {
    socket.emit("group_role_updated", {
        conversationId: GROUP_ID,
        userId: USER_B,
        role: "MEMBER"
    });
}, 9000);*/