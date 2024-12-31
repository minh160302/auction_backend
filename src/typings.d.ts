import { Action } from "@models/ws";
import { DefaultEventsMap } from "socket.io";

export interface ServerToClientEvents implements DefaultEventsMap {
    server_common: (data: { success: boolean; data: any }) => void;
    [key: string]: (data: { success: boolean; data: any }) => void;
}

export interface ClientToServerEvents implements DefaultEventsMap {
    clientMsg: (data: { message: any; room: string }) => void;
    auction: (data: { action: Action, body: any }) => void;
}