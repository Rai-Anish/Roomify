import { Request, Response } from "express";

export interface SseClient {
    id: string; // User ID
    res: Response;
}

let clients: SseClient[] = [];

export const addSseClient = (userId: string, req: Request, res: Response) => {
    clients.push({ id: userId, res });
    
    req.on("close", () => {
        clients = clients.filter(c => c.res !== res);
    });
};

export const sendSseEvent = (userId: number, event: string, data: any) => {
    const targetClients = clients.filter(c => c.id === userId.toString());
    targetClients.forEach(c => {
        c.res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    });
};
