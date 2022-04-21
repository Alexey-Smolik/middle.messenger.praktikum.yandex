export class WebSocketService {
    private ws: WebSocket;

    constructor(url: string) {
        this.ws = new WebSocket(url);
        this.initWs();
    }

    private initWs() {
        this.ws.addEventListener('open', () => {
            console.log('Соединение установлено');
        });

        this.ws.addEventListener('close', event => {
            if (event.wasClean) {
                console.log('Соединение закрыто чисто');
            } else {
                console.log('Обрыв соединения');
            }

            console.log(`Код: ${event.code} | Причина: ${event.reason}`);
        });

        this.ws.addEventListener('message', event => {
            console.log('Получены данные', event.data);
        });

        this.ws.addEventListener('error', err => {
            console.log('Ошибка', err?.message);
        });
    }
}