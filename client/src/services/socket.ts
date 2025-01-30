import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (): void => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SERVER_API, {
      transports: ['websocket'],
    });
  }
};

export const getSocket = (): Socket => {
  if (!socket) {
    initSocket();
  }
  // There will definitely be a Socket here at the time of the return, so I used “!”
  return socket!;
};
