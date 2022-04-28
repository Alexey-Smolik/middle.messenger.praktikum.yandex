import { Block } from '../../../components/block';
import './messages-window.component.scss';
import { AddUserComponent } from '../add-user/add-user.component';
import { ConfirmWindowComponent } from '../../../components/confirm-window/confirm-window.component';
import { ChatsService } from '../../../services/api/chats.service';
import store from '../../../services/store/store.service';
import { WebSocketService } from '../../../services/websocket.service';
import { Message } from '../../../types/message.type';
import { Chat } from '../../../types/chat.type';

interface ChatMessage extends Message {
  isSentMessage: boolean;
}

interface MessagesWindowProps {
  selectedChat?: Chat | null;
  messages?: ChatMessage[];
  showOptionsWindow?: boolean;
  showAddUserWindow?: boolean;
  addUserWindow?: AddUserComponent;
  showConfirmWindow?: boolean;
  confirmWindow?: ConfirmWindowComponent;
  updateData?: (chatId?: number, avatar?: string) => void;
}

const avatarUrl = 'https://ya-praktikum.tech/api/v2/resources';

const template = `if selectedChat
  .main-content-wrapper
    .header
      .header-wrapper
        .chat-wrapper
          if selectedChat.avatar
            .image(id='image')
              img(class='avatar', src=selectedChat.avatar)
          else
            .img-plug(id='image')
          input(type='file' id='avatar-input', accept='image/x-png,image/gif,image/jpeg')
          span.user-name #{selectedChat.title}
          .options-icon(id='options-icon', class={active: showOptionsWindow})
          if showOptionsWindow
            .options-wrapper(id='options-popup')
              .item(id='addUser')
                .icon.add
                span Добавить пользователя
              .item(id='removeUser')
                .icon.remove
                span Удалить пользователя
              .item(id='removeChat')
                .icon.remove
                span Удалить чат
    .messages-wrapper(id='messages')
      .messages-container
        each message in messages
          .message(class=message.isSentMessage ? 'sent-msg' : 'received-msg') #{message.content}
            span.message-time #{message.time}
    .footer-panel
      .footer
        .attachments-icon
        input.message-input(id='messageInput' type='text', placeholder='Сообщение', name='message')
        .send-icon.disabled(id='sendIcon')
else
  .plug Выберите чат чтобы отправить сообщение
if showAddUserWindow
  != addUserWindow
if showConfirmWindow
  != confirmWindow`;

export class MessagesWindowComponent extends Block<MessagesWindowProps> {
  isChatSelected = false;
  token = '';
  chatsService = new ChatsService();
  selectedChatId: number;
  webSocketService: WebSocketService;
  messageText = '';

  constructor(props: MessagesWindowProps) {
    super('section', props);
    this.initComponentEvents();
  }

  _render() {
    super._render();
  }

  render() {
    return this.compile(template, this.props);
  }

  initComponentEvents() {
    const content = this.getContent();
    const avatarInput = content.querySelector('#avatar-input');
    const sendIcon = content.querySelector('#sendIcon');

    if (this.selectedChatId !== this.props.selectedChat?.id) {
      this.token = '';
    }

    if (this.props.selectedChat) {
      this.selectedChatId = this.props.selectedChat.id;

      const messagesEl = content.querySelector('#messages');
      messagesEl.scrollTop = messagesEl?.scrollHeight;

      if (!this.token) {
        this.chatsService.getChatToken(this.props.selectedChat.id).then(res => {
          this.token = JSON.parse(res.data).token;
          this.initWebSocket();
        });
      }
    }

    content.querySelector('#image')?.addEventListener('click', () => avatarInput?.click());

    content.querySelector('#messageInput')?.addEventListener('input', event => {
      this.messageText = event.target.value;

      if (this.messageText) {
        sendIcon?.classList.remove('disabled');
      } else {
        sendIcon?.classList.add('disabled');
      }
    });

    sendIcon?.addEventListener('click', () => {
      this.sendMessage();
    });

    content.querySelector('#messageInput')?.addEventListener('keyup', event => {
      if (event.keyCode === 13 && this.messageText) {
        this.sendMessage();
      }
    });

    avatarInput?.addEventListener('change', () => {
      const formData = new FormData();
      formData.append('avatar', avatarInput.files[0]);
      formData.append('chatId', `${this.props.selectedChat?.id}`);

      this.chatsService.uploadChatAvatar(formData).then(res => {
        const data = JSON.parse(res.data);

        this.setProps({ selectedChat: { ...data, avatar: avatarUrl + data.avatar } });
        this.props.updateData(this.props.selectedChat?.id, avatarUrl + data.avatar);
        this.initComponentEvents();
      });
    });

    content.querySelector('#options-icon')?.addEventListener('click', () => {
      this.setProps({ showOptionsWindow: !this.props.showOptionsWindow });
      this.initComponentEvents();
    });

    if (this.props.showOptionsWindow) {
      document.addEventListener('click', event => {
        if (!([...event.target.classList].includes('options-icon') && this.props.showOptionsWindow)){
          this.setProps({
            showOptionsWindow: false
          });
          this.initComponentEvents();
        }
      });

      content.querySelector('#addUser')?.addEventListener('click', () => {
        this.children.addUserWindow = new AddUserComponent({
          classForRoot: 'add-user-wrapper',
          chatId: this.props.selectedChat?.id,
          closeWindow: () => {
            this.onAddUserWindowClose();
          }
        });

        this.setProps({
          showAddUserWindow: true,
          showOptionsWindow: false,
          addUserWindow: this.children.addUserWindow
        });
      });

      content.querySelector('#removeUser')?.addEventListener('click', () => {
        this.children.addUserWindow = new AddUserComponent({
          classForRoot: 'add-user-wrapper',
          deleteMode: true,
          chatId: this.props.selectedChat?.id,
          closeWindow: () => {
            this.onAddUserWindowClose();
          }
        });

        this.setProps({
          showAddUserWindow: true,
          showOptionsWindow: false,
          addUserWindow: this.children.addUserWindow
        });
      });

      content.querySelector('#removeChat')?.addEventListener('click', () => {
        this.children.confirmWindow = new ConfirmWindowComponent({
          classForRoot: 'confirm-window-wrapper',
          headerText: 'Удалить чат',
          confirmText: `Вы действительно хотите удалить '${this.props.selectedChat?.title}' чат?`,
          confirmBtnText: 'Удалить',
          cancelBtnText: 'Отменить',
          promiseForAccept: () => {
            return this.chatsService.deleteChatById(this.props.selectedChat?.id)
                .then(res => res.ok)
                .catch(() => false);
          },
          closeWindow: (withUpdate) => {
            this.onConfirmWindowClose(withUpdate);
          }
        });

        this.setProps({
          showConfirmWindow: true,
          showOptionsWindow: false,
          confirmWindow: this.children.confirmWindow
        });
      });
    }
  }

  onAddUserWindowClose() {
    this.setProps({
      showAddUserWindow: false
    });
  }

  onConfirmWindowClose(withUpdate: boolean) {
    this.setProps({
      showConfirmWindow: false
    });

    if (withUpdate) {
      this.props.updateData();
    }
  }

  private initWebSocket() {
    const currentUser = store.getState()?.user;

    if (currentUser && this.token && Number.isInteger(this.props.selectedChat?.id)) {
       this.webSocketService = new WebSocketService(
          `wss://ya-praktikum.tech/ws/chats/${currentUser.id}/${this.props.selectedChat.id}/${this.token}`, this
      );
    }
  }

  initMessages() {
    this.webSocketService.getOldMessages();
  }

  setMessages(data: Message[]) {
    this.setProps({ messages: data.map(msg => ({
        ...msg,
        isSentMessage: msg.user_id === store.getState().user.id,
        time: `${new Date(msg.time).getHours()}:${new Date(msg.time).getMinutes()}`
    }))});

    this.initComponentEvents();
  }

  setNewMessage(message: Message) {
    this.setProps({
      messages: [...this.props.messages,
      {
        ...message,
        isSentMessage: message.user_id === store.getState().user.id,
        time: `${new Date(message.time).getHours()}:${new Date(message.time).getMinutes()}`
      }] });

    this.initComponentEvents();
  }

  private sendMessage() {
    this.webSocketService.sendMessage(this.messageText);
  }
}

