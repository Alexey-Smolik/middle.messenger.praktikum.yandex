import { HTTPTransport } from '../request.service';
import { Chat } from '../../types/chat.type';

const chatAPIInstance = new HTTPTransport('/chats');

export interface AddDeleteChatUsersParams {
    chatId: number;
    users: number[];
}

interface DeleteChatRes {
    result: {
        id: number;
        title: string;
        created_by: number;
        avatar: string | null;
    };
    userId: number;
}

interface ChangeChatAvatarRes {
    avatar: string;
    created_by: number;
    id: number;
    title: string;
}

interface DeleteUserFromChatRes {
    chatId: number;
    users: number[];
}

interface GetChatTokenRes {
    token: string;
}

export class ChatsService {
    getChats(): Promise<Chat[]> {
        return chatAPIInstance.get('/') as Promise<Chat[]>;
    }

    createChat(title: string): Promise<number> {
        return chatAPIInstance.post('/', { data: { title } }) as Promise<number>;
    }

    deleteChatById(chatId: number): Promise<DeleteChatRes> {
        return chatAPIInstance.delete('/', { data: { chatId } }) as Promise<DeleteChatRes>;
    }

    uploadChatAvatar(formData: FormData): Promise<ChangeChatAvatarRes> {
        return chatAPIInstance.put('/avatar', { headers: { 'content-type': 'multipart/form-data' }, data: formData }) as Promise<ChangeChatAvatarRes>;
    }

    addUsersToChat(data: AddDeleteChatUsersParams): Promise<never> {
        return chatAPIInstance.put('/users', { data }) as Promise<never>;
    }

    deleteUsersFromChat(data: AddDeleteChatUsersParams): Promise<DeleteUserFromChatRes> {
        return chatAPIInstance.delete('/users', { data }) as Promise<DeleteUserFromChatRes>;
    }

    getChatToken(chatId: number): Promise<GetChatTokenRes> {
        return chatAPIInstance.post(`/token/${chatId}`) as Promise<GetChatTokenRes>;
    }
}
