export interface Message {


    id:string;

    conversationId:string;

    senderId:string;

    content:string;


    createdAt:string;


    sender:{
        id:string;
        username:string;
    };


    deliveryReceipts?:{

        userId:string;
        deliveredAt:string;

    }[];


    readReceipts?:{

        userId:string;
        readAt:string;

    }[];

}