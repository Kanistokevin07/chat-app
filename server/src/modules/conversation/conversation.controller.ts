import { Request, Response } from "express";
import { createGroupConversation, createPrivateConversation, getUserConversations,
    addGroupMember, removeGroupMember, leaveGroup, demoteMember, promoteMember
 } from "./conversation.service.js";

import { getIO } from "@/sockets/socket.js"
import { SOCKET_EVENTS } from "@/sockets/events.js";

export async function createConversationController(
    req: Request,
    res: Response
) {
    const userId = req.user!.id;
    const otherUserId = req.params.userId;

    if(typeof otherUserId !== "string"){
        throw new Error("Invalid user id");
    }

    const conversation = await createPrivateConversation(
        userId,
        otherUserId
    );

    res.status(201).json({
        success: true,
        data: conversation
    });
}

export async function getConversationsController(
    req:Request,
    res:Response
){

    const userId = req.user!.id;
    const conversations = await getUserConversations(userId);

    res.json({
        success:true,
        data:conversations
    });
}

export async function createGroupController(
    req: Request,
    res: Response
){
    const user = req.user!.id;
    const {name, members} = req.body;

    const conversation = await createGroupConversation(user, name, members);

    res.status(201).json({
        success: true,
        data: conversation
    });
}

export async function addMemberController(
    req:Request,
    res:Response
){

    const requesterId=req.user!.id;
    const conversationId=req.params.conversationId;
    const {userId}=req.body;

    if(typeof(conversationId) !== "string"){
        return res.status(400).json({
            success: false,
            data: "Invalid type"
        });
    }

    const member = await addGroupMember(
        conversationId,
        requesterId,
        userId
    );

    const io = getIO();

    io.to(conversationId).emit(SOCKET_EVENTS.GROUP_MEMBER_ADDED,{
        conversationId,
        userId,
        role: "Member"
    });

    io.to(userId).emit(SOCKET_EVENTS.NEW_GROUP, {
        conversationId
    });


    res.status(201).json({
        success:true,
        data:member
    });
}

export async function removeMemberController(
    req:Request,
    res:Response
){

    const conversationId = req.params.conversationId;
    const userId = req.params.userId;

    if(typeof(conversationId) !== "string"){
        return res.status(400).json({
            success: false,
            data: "convoId must be string"
        })
    }

    if(typeof(req.params.userId) !== "string"){
        return res.status(400).json({
            success: false,
            data: "UserId must be string"
        })
    }

    await removeGroupMember(
        conversationId,
        req.user!.id,
        req.params.userId
    );

    const io=getIO();


    io.to(conversationId)
        .emit(SOCKET_EVENTS.GROUP_MEMBER_REMOVED,{
            conversationId,
            userId
        }
    );

    io.to(userId).emit(SOCKET_EVENTS.REMOVED_FROM_GROUP,{
            conversationId
        }
    );

    res.json({
        success:true
    });
}

export async function leaveGroupController(
    req:Request,
    res:Response
){
    const conversationId = req.params.conversationId;
    const user = req.user?.id;

    if(typeof conversationId !== "string"){
        return res.status(400).json({
            success:false,
            data:"Invalid conversation id"
        });
    }


    await leaveGroup(
        conversationId,
        req.user!.id
    );

    const io=getIO();


    io.to(conversationId).emit(SOCKET_EVENTS.GROUP_MEMBER_LEFT,{
            conversationId,
            userId:req.user!.id
        }
    );

    io.to(req.user!.id).emit(SOCKET_EVENTS.REMOVED_FROM_GROUP,{
        conversationId
        }
    )


    res.json({
        success:true
    });

}   

export async function promoteMemberController(
    req:Request,
    res:Response
){
    const conversationId = req.params.conversationId;
    const userId = req.user?.id;

    if(typeof req.params.conversationId !== "string"){
        return res.status(400).json({
            success:false,
            data:"Invalid conversation id"
        });
    }


    if(typeof req.params.userId !== "string"){
        return res.status(400).json({
            success:false,
            data:"Invalid user id"
        });
    }


    const member =
        await promoteMember(
            req.params.conversationId,
            req.user!.id,
            req.params.userId
        );

    const io=getIO();


    io.to(conversationId).emit(SOCKET_EVENTS.GROUP_ROLE_UPDATED,{
            conversationId,
            userId,
            role:"ADMIN"
        }
    );


    res.json({
        success:true,
        data:member
    });

}

export async function demoteMemberController(
    req:Request,
    res:Response
){
    const conversationId = req.params.conversationId;
    const userId = req.user?.id;

    if(typeof req.params.conversationId !== "string"){
        return res.status(400).json({
            success:false,
            data:"Invalid conversation id"
        });
    }


    if(typeof req.params.userId !== "string"){
        return res.status(400).json({
            success:false,
            data:"Invalid user id"
        });
    }


    const member =
        await demoteMember(
            req.params.conversationId,
            req.user!.id,
            req.params.userId
        );
    const io = getIO();

    io.to(conversationId).emit(SOCKET_EVENTS.GROUP_ROLE_UPDATED,{
            conversationId,
            userId,
            role:"MEMBER"
        }
    );


    res.json({
        success:true,
        data:member
    });

}