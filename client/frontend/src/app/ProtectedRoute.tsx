import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";


interface Props{
    children:React.ReactNode;
}


export default function ProtectedRoute({
    children
}:Props){

    const isAuthenticated = useAuthStore(state=>state.isAuthenticated);
    const isLoading = useAuthStore(state=>state.isLoading);

    if(isLoading){
        return <div className="flex h-screen items-center justify-center">
            Loading...
        </div>;
    }

    if(!isAuthenticated){
        return <Navigate to="/login"/>;
    }

    return children;
}