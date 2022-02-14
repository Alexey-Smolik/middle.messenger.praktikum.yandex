import { Block } from '../../components/block';
import './chats.component.scss';
import { chatsData, messagesData } from './mock-data';
import { ChatComponent } from './chat/chat.component';
import { MessagesWindowComponent } from './messages-window/messages-window.component';
import { MessageComponent } from './messages-window/message/message.component';

interface ProfileProps {
  chats?: ChatComponent[];
  messagesWindow?: MessagesWindowComponent[];
  classForRoot: string;
}

const template = `.chats-wrapper__left-panel
  .header-container
    .header
      .header__profile-link
        a(href='#') Профиль >
      .header__search
        input(type='text', placeholder='Поиск')
  .chats-container(id='chats')
    if chats
      each chat in chats
        != chat
.chats-wrapper__right-panel
  if messagesWindow
    each window in messagesWindow
      != window`;

export class ChatsComponent extends Block<ProfileProps> {
  chats: ChatComponent[];

  constructor(props: ProfileProps) {
    super('div', props)
    this.initChildren();
  }

  render() {
    return this.compile(template, this.props);
  }

  private initChildren() {
    this.chats = chatsData.map(props => {
      return new ChatComponent({
        ...props,
        ...{ events: { click: () => this.onChatClick(props.id) } }
      });
    });

    this.children.chats = this.chats;
    this.children.messagesWindow = [new MessagesWindowComponent({ selectedChat: null, messages: [] })];

    this.setProps({
      ...this.props,
      chats: this.children.chats,
      messagesWindow: this.children.messagesWindow
    })
  }

  private onChatClick(id: number) {
    const messages: MessageComponent[] = messagesData.map(msg => new MessageComponent(msg));

    this.children.messagesWindow[0].children.messages = messages;
    this.children.messagesWindow[0].setProps({
      selectedChat: chatsData.find(chat => chat.id === id),
      messages: messages,
    });
  }
}
