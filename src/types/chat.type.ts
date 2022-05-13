import { User } from './user.type';

export interface Chat {
    id: number;
    avatar: string | null;
    created_by: number;
    title: string;
    unread_count: number;
    last_message: {
        id: number;
        content: string;
        time: string;
        user: User;
    }
}