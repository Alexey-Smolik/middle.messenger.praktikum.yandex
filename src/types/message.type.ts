import { MessageFile } from './message-file.type';

export interface Message {
    id: number;
    user_id: number;
    chat_id: number;
    type: string;
    time: string;
    content: string;
    is_read: boolean;
    file: MessageFile | null;
}