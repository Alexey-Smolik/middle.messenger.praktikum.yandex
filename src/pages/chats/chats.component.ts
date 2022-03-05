import {Block, Event} from '../../components/block';
import './chats.component.scss';
import { chatsData, messagesData } from './mock-data';
import { ChatsListComponent } from './chats-list/chats-list.component';
import { MessagesWindowComponent } from './messages-window/messages-window.component';
import { MessagesListComponent } from './messages-window/messages-list/messages-list.component';

interface ProfileProps {
  chatsList?: ChatsListComponent;
  messagesWindow?: MessagesWindowComponent;
  classForRoot: string;
  // events?: Event[];
}

const template = `.chats-wrapper__left-panel
  .header-container
    .header
      .header__profile-link
        a(href='#') Профиль >
      .header__search
        input(type='text', placeholder='Поиск')
  .chats-container(id='chats')
    != chatsList
.chats-wrapper__right-panel
  != messagesWindow`;

export class ChatsComponent extends Block<ProfileProps> {
  // chatsList: ChatsListComponent[];

  constructor(props: ProfileProps) {
    super('div', props)
    this.initChildren();
  }

  render() {
    return this.compile(template, this.props);
  }

  private initChildren() {
    this.children.chatsList = new ChatsListComponent({
      chats: chatsData,
      click: this.onChatClick.bind(this)
    });
    this.children.messagesWindow = new MessagesWindowComponent({ selectedChat: null, messages: [] });

    this.setProps({
      ...this.props,
      chatsList: this.children.chatsList,
      messagesWindow: this.children.messagesWindow
    });
  }

  private onChatClick(id: number) {
    this.children.messagesWindow.setProps({
      selectedChat: chatsData.find(chat => chat.id === id),
      messages: messagesData
    });
  }
}
