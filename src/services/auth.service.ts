import { HTTPTransport } from './request.service';

const transport = new HTTPTransport();

export function isLogin() {
    return transport.get('/auth/user').then(() => {
        return true;
    }).catch(() => {
        return false;
    });
}