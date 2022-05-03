import { HTTPTransport } from '../request.service';
import { UserData } from './users.service';

const authAPIInstance = new HTTPTransport('/auth');

export interface SignUpData {
    first_name: string,
    second_name: string,
    login: string,
    email: string,
    password: string,
    phone: string
}

export interface SignInData {
    login: string,
    password: string
}

interface SignUpRes {
    id: number;
}

export class AuthService {
    signUp(data: SignUpData): Promise<SignUpRes> {
        return authAPIInstance.post('/signup', { data }) as Promise<SignUpRes>;
    }

    signIn(data: SignInData): Promise<never> {
        return authAPIInstance.post('/signin', { data }) as Promise<never>;
    }

    getUserInfo(): Promise<UserData> {
        return authAPIInstance.get('/user') as Promise<UserData>;
    }
    
    logout(): Promise<never> {
        return authAPIInstance.post('/logout') as Promise<never>;
    }
}
