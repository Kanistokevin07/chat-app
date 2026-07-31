import { create } from "zustand";

interface SocketState{
    connected: boolean,
    setConnected: (value: boolean) => void;
}

export const useSocketStore = create<SocketState>((set)=>({
    connected: false,
    setConnected: (value: boolean)=>
        set({
            connected: value
        })
}));