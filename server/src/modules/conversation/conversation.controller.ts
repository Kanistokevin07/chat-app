import { Request, Response } from "express";
import { createPrivateConversation, getUserConversations } from "./conversation.service.js";

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