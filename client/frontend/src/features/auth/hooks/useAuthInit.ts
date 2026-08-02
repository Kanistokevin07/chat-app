import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store.ts";
import { refreshSession } from "../api/auth.api";
import { getMe } from "../api/auth.api";


export function useAuthInit(){

    const setAccessToken = useAuthStore(
        state=>state.setAccessToken
    );

    const setUser = useAuthStore(
        state=>state.setUser
    );

    const setAuth = useAuthStore(
        state=>state.setAuth
    );

    const logout = useAuthStore(
        state=>state.logout
    );


    const setLoading = useAuthStore(
        state=>state.setLoading
    );


    useEffect(()=>{
        async function init(){
            try{
                setLoading(true);
                const refresh = await refreshSession();

                setAccessToken(
                    refresh.accessToken
                );

                const user = await getMe();
                setUser(user);

                setAuth(user, refresh.accessToken);

            }catch(error){
                console.log("No active session");
                logout();
            }
            finally{
                setLoading(false);
            }
        }
        init();
    },[]);
}