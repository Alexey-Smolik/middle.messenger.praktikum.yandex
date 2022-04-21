import { HTTPTransport } from '../request.service';

const chatAPIInstance = new HTTPTransport('/chats');

export interface AddDeleteChatUsersParams {
    chatId: number;
    users: number[];
}

export class ChatsService {
    getChats() {
        return chatAPIInstance.get('/');
    }

    createChat(title: string) {
        return chatAPIInstance.post('/', { data: { title } });
    }

    deleteChatById(chatId: number) {
        return chatAPIInstance.delete('/', { data: { chatId } });
    }

    uploadChatAvatar(formData: FormData) {
        return chatAPIInstance.put('/avatar', { headers: { 'content-type': 'multipart/form-data' }, data: formData });
    }

    addUsersToChat(data: AddDeleteChatUsersParams) {
        return chatAPIInstance.put('/users', { data });
    }

    deleteUsersFromChat(data: AddDeleteChatUsersParams) {
        return chatAPIInstance.delete('/users', { data });
    }

    getChatToken(chatId: number) {
        return chatAPIInstance.post(`/token/${chatId}`);
    }
}