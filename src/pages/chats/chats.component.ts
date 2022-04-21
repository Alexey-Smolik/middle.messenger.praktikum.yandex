import { Block } from '../../components/block';
import './chats.component.scss';
import { messagesData } from './mock-data';
import { Chat, ChatsListComponent } from './chats-list/chats-list.component';
import { MessagesWindowComponent } from './messages-window/messages-window.component';
import { CreateChatComponent } from './create-chat/create-chat.component';
import { ChatsService } from '../../services/api/chats.service';
import { AuthService } from '../../services/api/auth.service';

interface ProfileProps {
  chatsList?: ChatsListComponent;
  messagesWindow?: MessagesWindowComponent;
  classForRoot?: string;
  showChatCreationWindow?: boolean;
  createChatWindow?: CreateChatComponent;
}

const avatarUrl = 'https://ya-praktikum.tech/api/v2/resources';

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

  constructor(props: ProfileProps) {
    super('div', props)
    this.initChildren();
  }

  render() {
    return this.compile(template, this.props);
  }

  private initChildren() {
    this.authService.getUserInfo().then(res => {
      if (res) {
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
          chats:  this.chats,
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
        window.location = '/';
      }
    }).catch(() => window.location = '/');
  }

  private onChatClick(id: number) {
    this.children.messagesWindow.setProps({
      selectedChat: this.chats.find(chat => chat.id === id),
      messages: messagesData,
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
