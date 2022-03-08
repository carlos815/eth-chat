export interface ChatDb {
    chats?: { [key: string]: Chat };
    members?: { [key: string]: Member };
    messages?: { [key: string]: { [key: string]: Message } };
    users?: { [key: string]: User };
}

export interface Chat {
    title: string;
    lastMessage: string;
    timestamp: number;
}

export interface Member {
    [key: string]: boolean;
}


export interface Message {
    name: string;
    message: string;
    timestamp: number;
    id?: string
}

export interface User {
    chatsWith: { [key: string]: string }
}

export enum RequestStatus {
    success, loading, error, idle
}
