import { Server, Socket } from "socket.io";

import {
    addGroupMember,
    removeGroupMember,
    leaveGroup,
    promoteMember,
    demoteMember
} from "@/modules/conversation/conversation.service.js";

import { SOCKET_EVENTS } from "../events.js";

export function registerGroupHandlers(
    io: Server,
    socket: Socket
){

    socket.on(SOCKET_EVENTS.GROUP_MEMBER_ADDED, async(data)=>{

        const { conversationId, userId } = data;

        const member = await addGroupMember(
            conversationId,
            socket.data.user.id,
            userId
        );

        io.to(conversationId).emit(
            SOCKET_EVENTS.GROUP_MEMBER_ADDED,
            member
        );

        io.to(userId).emit(
            SOCKET_EVENTS.GROUP_MEMBER_ADDED,
            member
        );
    });


    socket.on(SOCKET_EVENTS.GROUP_MEMBER_REMOVED, async(data)=>{

        const { conversationId, userId } = data;

        await removeGroupMember(
            conversationId,
            socket.data.user.id,
            userId
        );

        io.to(conversationId).emit(
            SOCKET_EVENTS.GROUP_MEMBER_REMOVED,
            {
                conversationId,
                userId
            }
        );

        io.to(userId).emit(
            SOCKET_EVENTS.GROUP_MEMBER_REMOVED,
            {
                conversationId
            }
        );
    });


    socket.on(SOCKET_EVENTS.GROUP_MEMBER_LEFT, async(data)=>{

        const { conversationId } = data;

        await leaveGroup(
            conversationId,
            socket.data.user.id
        );

        socket.leave(conversationId);

        io.to(conversationId).emit(
            SOCKET_EVENTS.GROUP_MEMBER_LEFT,
            {
                conversationId,
                userId: socket.data.user.id
            }
        );
    });


    socket.on(SOCKET_EVENTS.GROUP_ROLE_UPDATED, async (data) => {
        const { conversationId, userId, role } = data;

        const member =
            role === "ADMIN"
                ? await promoteMember(conversationId, socket.data.user.id, userId)
                : await demoteMember(conversationId, socket.data.user.id, userId);

        io.to(conversationId).emit(
            SOCKET_EVENTS.GROUP_ROLE_UPDATED,
            member
        );
    });

}