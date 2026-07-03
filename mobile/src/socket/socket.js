import { io } from "socket.io-client";

const socket = io("http://172.20.41.249:8000", {
  transports: ["websocket"],
});

export default socket;