import { useMutation } from "@tanstack/react-query";
import { logout } from "../api/auth.api";
import { useAuthStore } from "@/stores/auth.store";

export function useLogout() {

    const logoutStore = useAuthStore(state => state.logout);

    return useMutation({

        mutationFn: logout,

        onSuccess: () => {

            logoutStore();

        }

    });

}