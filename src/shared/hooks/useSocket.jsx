import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3200'); // o la URL de tu server

export function useSocket(eventName, callback) {
  useEffect(() => {
    socket.on(eventName, callback);
    return () => socket.off(eventName, callback);
  }, [eventName, callback]);
}
