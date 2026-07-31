import {socket} from "./socket.ts";
import { useMessageStore } from "@/stores/message.store.ts";

export function registerSocketListeners(){

    socket.on("new_message", (message)=>{

        useMessageStore.getState().addMessage(
            message.conversationId,
            message
        );

    });
}