import {create} from "zustand";
import type {Conversation} from "@/types/conversation";
import { getConversations } from "@/features/auth/api/conversation.api.ts";

interface ConversationState{

    conversations:Conversation[];

    activeConversationId:string|null;

    setActiveConversation:(id:string)=>void;

    fetchConversations:()=>Promise<void>;

    addConversation:(conversation:Conversation)=>void;

}



export const useConversationStore = create<ConversationState>((set)=>({

    conversations:[],
    activeConversationId:null,

    setActiveConversation:(id)=>
        set({
            activeConversationId:id
        }),

    fetchConversations:async()=>{
        const data = await getConversations();

        set({
            conversations:data
        });

    },

    addConversation:(conversation)=>
        set(state=>({
            conversations:[
                conversation,
                ...state.conversations
            ]
        }))

}));