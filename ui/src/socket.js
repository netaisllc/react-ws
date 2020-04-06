import io from 'socket.io-client';
const WS_SERVICE = 'http://localhost:4001';
const socket = io.connect(WS_SERVICE);
export { socket };
