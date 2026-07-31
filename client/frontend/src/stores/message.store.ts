import {create} from "zustand";
import type {Message} from "@/types/message";

interface MessageState{

    messages: Record<string,Message[]>;

    addMessage:(conversationId:string,message:Message)=>void;

    setMessages:(conversationId:string,messages:Message[])=>void;
}



export const useMessageStore = create<MessageState>((set)=>({

    messages:{},

    addMessage:(conversationId,message)=>
        set(state=>({
            messages:{
                ...state.messages,
                [conversationId]:
                [
                    ...(state.messages[conversationId] ?? []),
                    message
                ]
            }
        })),

    setMessages:(conversationId,messages)=>
        set(state=>({
            messages:{
                ...state.messages,
                [conversationId]:messages
            }
        }))
}));