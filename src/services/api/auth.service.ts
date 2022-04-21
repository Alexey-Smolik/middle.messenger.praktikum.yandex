import { HTTPTransport } from '../request.service';

const authAPIInstance = new HTTPTransport('/auth');

export interface SignUpData {
    first_name: string,
    second_name: string,
    login: string,
    email: string,
    password: string,
    phone: string
}

export interface SigninData {
    login: string,
    password: string
}

export class AuthService {
    signUp(data: SignUpData) {
        return authAPIInstance.post('/signup', { data });
    }

    signIn(data: SigninData) {
        return authAPIInstance.post('/signin', { data });
    }

    getUserInfo() {
        return authAPIInstance.get('/user');
    }
    
    logout() {
        return authAPIInstance.post('/logout');
    }
}

// return transport.get('/auth/user').then(() => {
//     return true;
// }).catch(() => {
//     return false;
// });