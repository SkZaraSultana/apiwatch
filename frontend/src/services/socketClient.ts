import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (url = import.meta.env.VITE_API_URL || window.location.origin) => {
  if (socket) return socket;
  socket = io(url, {
    path: "/socket.io",
    transports: ["websocket"],
    reconnection: true,
  });

  socket.on("connect_error", (err) => {
    // eslint-disable-next-line no-console
    console.warn("Socket connect error:", err.message || err);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (!socket) return;
  try {
    socket.disconnect();
  } finally {
    socket = null;
  }
};

export const getSocket = () => socket;
