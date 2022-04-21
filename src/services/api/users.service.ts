import { HTTPTransport } from '../request.service';

const usersAPIInstance = new HTTPTransport('/user');

export interface UserData {
    first_name: string,
    second_name: string,
    display_name: string,
    login: string,
    email: string,
    phone: string
}

export interface ChangePasswordData {
    oldPassword: string,
    newPassword: string
}

export class UsersService {
    changeUserData(data: UserData) {
        return usersAPIInstance.put('/profile', { data });
    }

    changeUserAvatar(formData: FormData) {
        return usersAPIInstance.put('/profile/avatar', {
            headers: { 'content-type': 'multipart/form-data' },
            data: formData 
        });
    }

    changeUserPassword(data: ChangePasswordData) {
        return usersAPIInstance.put('/password', { data });
    }

    getUserById(userId: number) {
        return usersAPIInstance.get(`/${userId}`);
    }

    searchUsersByLogin(login: string) {
        return usersAPIInstance.post(`/search`, { data: { login } });
    }
}