import { useEffect, useRef } from "react";
import { connectSocket, disconnectSocket, getSocket } from "../services/socketClient";
import { useAuth } from "./useAuth";

export const useSocket = () => {
  const { user } = useAuth();
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (user) {
      socketRef.current = connectSocket();
    }

    return () => {
      // disconnect on unmount or logout
      if (socketRef.current) {
        disconnectSocket();
        socketRef.current = null;
      }
    };
  }, [user]);

  return getSocket();
};
