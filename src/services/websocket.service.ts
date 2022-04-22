export class WebSocketService {
    private ws: WebSocket;
    private __instance;

    constructor(url: string, __instance: never) {
        this.ws = new WebSocket(url);
        this.__instance = __instance;
        this.initWs();
    }

    getOldMessages(offset = 0) {
        this.ws.send(JSON.stringify({
            content: offset.toString(),
            type: 'get old'
        }));
    }

    sendMessage(text: string) {
        this.ws.send(JSON.stringify({
            content: text,
            type: 'message'
        }));
    }

    private initWs() {
        this.ws.addEventListener('open', () => {
            console.log('Соединение установлено');
            this.__instance.initMessages();
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
            console.log('Получены данные');

            if (event.type === 'message') {
                const data = JSON.parse(event.data);

                if (data.type === 'user connected') {
                    return;
                }

                if (Array.isArray(data)) {
                    this.__instance.setMessages(data.reverse());
                } else {
                    this.__instance.setNewMessage(data);
                }
            }
        });

        this.ws.addEventListener('error', err => {
            console.log('Ошибка', err?.message);
        });
    }
}