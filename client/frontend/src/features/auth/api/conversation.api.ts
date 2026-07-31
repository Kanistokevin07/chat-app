import api from "@/lib/axios";

export async function getConversations(){
    const res = await api.get("/conversations");
    return res.data.data;
}

export async function createPrivateConversation(
    userId:string
){

    const res = await api.post(`/conversations/private/${userId}`);

    return res.data.data;
}



export async function createGroup(
    name:string,
    members:string[]
){

    const res = await api.post("/conversations/group", {
            name,
            members
        }
    );

    return res.data.data;
}