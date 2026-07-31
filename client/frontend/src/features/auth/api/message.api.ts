import api from "@/lib/axios";


export async function getMessages(
    conversationId:string,
    cursor?:string
){

    const res =
        await api.get(
            `/messages/${conversationId}`,
            {
                params:{
                    cursor
                }
            }
        );


    return res.data.data;
}



export async function syncMessages(
    conversationId:string
){

    const res = await api.get(
        `/messages/${conversationId}/sync`
    );

    return res.data.data;
}