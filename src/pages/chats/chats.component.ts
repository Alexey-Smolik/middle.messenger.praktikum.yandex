import { Block } from '../../components/block';
import './chats.component.scss';
import { messagesData } from './mock-data';
import {Chat, ChatsListComponent} from './chats-list/chats-list.component';
import { MessagesWindowComponent } from './messages-window/messages-window.component';
import { HTTPTransport} from "../../services/request.service";
import { isLogin } from "../../services/auth.service";
import { CreateChatComponent } from './create-chat/create-chat.component';

interface ProfileProps {
  chatsList?: ChatsListComponent;
  messagesWindow?: MessagesWindowComponent;
  classForRoot?: string;
  showChatCreationWindow?: boolean;
  createChatWindow?: CreateChatComponent;
}

const transport = new HTTPTransport();
const avatarUrl = 'https://ya-praktikum.tech/api/v2/resources';

const template = `.chats-wrapper__left-panel
  .header-container
    .header
      .header__profile-links
        .add-chat(id='addChat') + Add chat
        a(href='/settings') Профиль >
      .header__search
        input(type='text', placeholder='Поиск')
  .chats-container(id='chats')
    != chatsList
.chats-wrapper__right-panel
  != messagesWindow
if showChatCreationWindow
  != createChatWindow`;

export class ChatsComponent extends Block<ProfileProps> {
  chats: Chat[] = [];

  constructor(props: ProfileProps) {
    super('div', props)
    this.initChildren();
  }

  render() {
    return this.compile(template, this.props);
  }

  private initChildren() {
    isLogin().then(res => {
      if (res) {
        return transport.get('/chats').then(res => JSON.parse(res.data));
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
          chats:  this.chats,
          click: this.onChatClick.bind(this)
        });

        this.children.messagesWindow = new MessagesWindowComponent({ selectedChat: null, messages: [] });

        this.setProps({
          ...this.props,
          chatsList: this.children.chatsList,
          messagesWindow: this.children.messagesWindow
        });

        this.initComponentEvents();
      } else {
        window.location = '/';
      }
    });
  }

  private onChatClick(id: number) {
    this.children.messagesWindow.setProps({
      selectedChat: this.chats.find(chat => chat.id === id),
      messages: messagesData
    });
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
}
