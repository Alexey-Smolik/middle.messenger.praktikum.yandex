import {ChatComponent} from './chat/chat.component';
import {ChatModel, chats, messages} from './mock-data';
import {MessagesWindowComponent} from './messages-window/messages-window.component';
import {MessageComponent} from './messages-window/message/message.component';

interface ChatState {
  selectedChat: ChatModel | null;
  messages: MessageComponent[]
}

export const chatState: ChatState = {
  selectedChat: null,
  messages: []
}

const chatsRootEl = document.getElementById('chats');
const messageWindowRootEl = document.getElementById('messageWindow');

const messageWindowComponent = new MessagesWindowComponent(chatState);

messageWindowRootEl.appendChild(messageWindowComponent.getContent());

chats.map(props => {
  const chat = new ChatComponent({
    ...props, ...{
      events: {
        click: event => onCLick(event, props.id)
      }
    }
  });

  chatsRootEl.appendChild(chat.getContent());

  return chat;
});

function onCLick(event, id) {
  chatState.selectedChat = chats.find(chat => chat.id === id);
  chatState.messages = messages.map(msg => new MessageComponent(msg));

  messageWindowComponent.setProps(chatState);
  messageWindowComponent.addEvents();
}
