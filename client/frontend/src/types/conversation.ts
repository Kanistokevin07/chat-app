import type { Message } from "./message";

export interface Conversation {
    id:string;

    type:"PRIVATE"|"GROUP";
  
    name:string|null;
  
    members?:User[];
  
    lastMessage?:Message|null;
  
    unreadCount:number;
  
    updatedAt:string;
}



export interface User {
    id:string;
    username:string;
    email:string;
}