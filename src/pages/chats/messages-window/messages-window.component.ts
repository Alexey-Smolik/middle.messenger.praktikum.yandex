import { Block } from '../../../components/block';
import { MessageModel } from '../mock-data';
import { Chat } from '../chats-list/chats-list.component';
import './messages-window.component.scss';
import { AddUserComponent } from '../add-user/add-user.component';
import { ConfirmWindowComponent } from '../../../components/confirm-window/confirm-window.component';
import { ChatsService } from '../../../services/api/chats.service';

interface MessagesWindowProps {
  selectedChat?: Chat | null;
  messages?: MessageModel[];
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
    .messages-wrapper
      .messages-container
        each message in messages
          .message(class=message.isSentMessage ? 'sent-msg' : 'received-msg') #{message.text}
            span.message-time #{message.date.getHours()}:#{message.date.getMinutes()}
    .footer-panel
      form
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
  init = false;
  chatsService = new ChatsService();
  // ws: WebSocket;


  constructor(props: MessagesWindowProps) {
    super('section', props);
  }

  _render() {
    super._render();
    this.initComponentEvents();
  }

  render() {
    return this.compile(template, this.props);
  }

  initComponentEvents() {
    if (this.props.selectedChat) {
      if (this.token || this.init) {

      } else {
        this.init = true;

        this.chatsService.getChatToken(this.props.selectedChat.id).then(res => {
          this.token = JSON.parse(res.data).token.token;
          this.init = false;
        });
      }
    }

    const content = this.getContent();
    const avatarInput = content.querySelector('#avatar-input');

    content.querySelector('#image')?.addEventListener('click', () => avatarInput?.click());

    content.querySelector('#messageInput')?.addEventListener('input', event => {
      if (event.target.value) {
        content.querySelector('#sendIcon')?.classList.remove('disabled');
      } else {
        content.querySelector('#sendIcon')?.classList.add('disabled');
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
    });

    if (this.props.showOptionsWindow) {
      document.addEventListener('click', event => {
        if (!([...event.target.classList].includes('options-icon') && this.props.showOptionsWindow)){
          this.setProps({
            showOptionsWindow: false
          });
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

  // private initWebSocket() {
  //   this.ws = new WebSocketService(`wss://ya-praktikum.tech/ws/chats/${}/<CHAT_ID>/<TOKEN_VALUE>`);
  // }
}

