import io from "socket.io-client";
//import * as globales from '../data/globales'
export const socket = io.connect("wss://abiding-circle-325403.uc.r.appspot.com",{transports: ['polling']})