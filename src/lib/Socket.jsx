import { useContext, useEffect } from "react";
import { useMemo } from "react";
import { createContext } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const getSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

const SocketProvider = ({ children }) => {
  const { token } = useSelector((state) => state.user);

  const socket = useMemo(() => {
    if (!token) return null;
    const socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection event listeners
    socketInstance.on("connect", () => console.log("Socket connected"));
    socketInstance.on("disconnect", () => console.log("Socket disconnected"));
    socketInstance.on("connect_error", (err) =>
      console.error("Socket error:", err)
    );

    return socketInstance;
  }, [token]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return <SocketContext value={socket}>{children}</SocketContext>;
};

export default SocketProvider;
