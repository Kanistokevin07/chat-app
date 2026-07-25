import { Request, Response } from "express";
import { createMessage, getMessages, markConversationRead, createDeliveryReceipt,
    createReadReceipt
 } from "./message.service.js";


export async function getMessagesController(
    req: Request,
    res: Response
) {
    const conversationId = req.params.conversationId;
    const userId = req.user!.id;

    if(typeof(conversationId) !== "string"){
        return res.status(400).json({
            success:false,
            message:"Invalid conversation id"
        });
    }

    const cursor = req.query.cursor as string | undefined;
    const limit = Number(req.query.limit) || 30;

    const result = await getMessages(
        conversationId,
        userId,
        cursor,
        limit
    );

    res.status(200).json({
        success: true,
        data: result
    });
}

export async function createMessageController(
    req: Request,
    res: Response
) {
    const conversationId = req.params.conversationId;
    const senderId = req.user!.id;
    const { content } = req.body;

    if(typeof(conversationId) !== "string"){
        return res.status(400).json({
            success:false,
            message:"Invalid conversation id"
        });
    }

    const message = await createMessage(
        conversationId,
        senderId,
        content
    );

    res.status(201).json({
        success: true,
        data: message
    });
}

export async function markConversationReadController(
    req:Request,
    res:Response
){

    const userId = req.user!.id;
    const {conversationId} = req.params;

    if(typeof(conversationId) !== "string"){
        return res.status(400).json({
            success:false,
            message:"Invalid conversation id"
        });
    }

    await markConversationRead(conversationId, userId);

    res.json({  success:true});
}

export async function createDeliveryReceiptController(
    req: Request,
    res: Response
) {
    const messageId = req.params.messageId;
    const userId = req.user!.id;

    if (typeof messageId !== "string") {
        return res.status(400).json({
            success: false,
            message: "Invalid message id"
        });
    }

    const receipt = await createDeliveryReceipt(
        messageId,
        userId
    );

    res.status(201).json({
        success: true,
        data: receipt
    });
}

export async function createReadReceiptController(
    req: Request,
    res: Response
) {
    const messageId = req.params.messageId;
    const userId = req.user!.id;

    if (typeof messageId !== "string") {
        return res.status(400).json({
            success: false,
            message: "Invalid message id"
        });
    }

    const receipt = await createReadReceipt(
        messageId,
        userId
    );

    res.status(201).json({
        success: true,
        data: receipt
    });
}

