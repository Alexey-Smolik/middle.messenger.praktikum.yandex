import { Block } from '../../components/block';
import './chats.component.scss';
import { ChatsListComponent } from './chats-list/chats-list.component';
import { MessagesWindowComponent } from './messages-window/messages-window.component';
import { CreateChatComponent } from './create-chat/create-chat.component';
import { ChatsService } from '../../services/api/chats.service';
import { AuthService } from '../../services/api/auth.service';
import store from '../../services/store/store.service';
import { Chat } from '../../types/chat.type';
import router from "../../../index";

interface ProfileProps {
  chatsList?: ChatsListComponent;
  messagesWindow?: MessagesWindowComponent;
  classForRoot?: string;
  showChatCreationWindow?: boolean;
  createChatWindow?: CreateChatComponent;
}

const avatarUrl = 'https://ya-praktikum.tech/api/v2/resources';
const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июня', 'июля', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

const template = `.chats-wrapper__left-panel
  .header-container
    .header
      .header__profile-links
        .add-chat(id='addChat', class='action') + Add chat
        a(href='/settings', class='action') Профиль >
      .header__search
        input(type='text', placeholder='Поиск')
  .chats-container(id='chats')
    != chatsList
.chats-wrapper__right-panel
  != messagesWindow
if showChatCreationWindow
  != createChatWindow`;

export class ChatsComponent extends Block<ProfileProps> {
  chatsService = new ChatsService();
  authService = new AuthService();
  chats: Chat[] = [];
  currDate: Date = new Date();
  selectedChatId: number;

  constructor(props) {
    super('div', props)
    this.initChildren();
  }

  render() {
    return this.compile(template, this.props);
  }

  private initChildren() {
    this.authService.getUserInfo().then(res => {
      if (res) {
        store.set('user', JSON.parse(res.data));

        return this.chatsService.getChats().then(res => JSON.parse(res.data));
      } else {
        return false;
      }
    }).then(res => {
      if (res) {
        this.chats = res.map(chat => {
          if (chat.avatar) {
            chat.avatar = avatarUrl + chat.avatar;
          }

          return chat;
        });

        this.children.chatsList = new ChatsListComponent({
          chats: this.chats.map(chat => this.convertChartDate(chat)),
          click: this.onChatClick.bind(this)
        });

        this.children.messagesWindow = new MessagesWindowComponent({
          selectedChat: null,
          messages: [],
          showOptionsWindow: false
        });

        this.setProps({
          ...this.props,
          chatsList: this.children.chatsList,
          messagesWindow: this.children.messagesWindow,
        });

        this.initComponentEvents();
      } else {
        router.go('/');
      }
    }).catch(() => router.go('/'));
  }

  private onChatClick(id: number) {
    if (this.selectedChatId !== id) {
      this.selectedChatId = id;

      this.children.messagesWindow.setProps({
        selectedChat: this.chats.find(chat => chat.id === id),
        showOptionsWindow: false,
        updateData: (chatId?: number, avatar?: string) => {
          if (Number.isInteger(chatId)) {
            this.children.chatsList.setProps({
              chats: this.children.chatsList.props.chats.map(chat => {
                if (chat.id === chatId) {
                  chat.avatar = avatar;
                }

                return chat;
              })
            });

            this.children.chatsList.initComponentEvents();
          } else {
            this.initChildren();
          }
        }
      });

      this.children.messagesWindow.initComponentEvents();
    }
  }

  private initComponentEvents() {
    const content = this.getContent();

    content.querySelector('#addChat')?.addEventListener('click', () => {
      this.children.createChatWindow = new CreateChatComponent({
        classForRoot: 'create-chat-wrapper',
        closeWindow: (withUpdate: boolean) => {
          this.onCreateChatWindowClose(withUpdate);
        }
      });

      this.setProps({
        showChatCreationWindow: true,
        createChatWindow: this.children.createChatWindow
      });
    });
  }

  private onCreateChatWindowClose(withUpdate: boolean) {
    this.setProps({
      showChatCreationWindow: false
    });

    if (withUpdate) {
      this.initChildren();
    } else {
      this.initComponentEvents();
    }
  }

  private convertChartDate(chat: Chat): Chat {
    if (chat.last_message) {
      const time = new Date(chat.last_message.time);

      if (
          this.currDate.getFullYear() > time.getFullYear() ||
          this.currDate.getMonth() > time.getMonth() ||
          (this.currDate.getDate() - 6) > time.getDate()
      ) {
        chat.last_message.time = `${time.getDate()} ${months[time.getMonth()]} ${time.getFullYear()}`;
      } else {
        chat.last_message.time = time.getDate() === this.currDate.getDate() ?
            `${time.getHours()}:${time.getMinutes()}` :
            `${days[time.getDay()]}`;
      }
    }

    return chat;
  }
}
