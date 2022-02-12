import { Block } from '../../../components/block';
import { MessageComponent } from './message/message.component';
import { ChatModel } from '../mock-data';

interface MessagesWindowProps {
  selectedChat: ChatModel;
  messages: MessageComponent[];
}

const template = `if selectedChat
  .main-content-wrapper
    .header
      .header-wrapper
        .img-plug
        span.user-name #{selectedChat.name}
        .options-icon
    .messages-wrapper
      .messages-container
        each msg in messages
          != msg
    .footer-panel
      form
        .attachments-icon
        input.message-input(id='messageInput' type='text', placeholder='Сообщение', name='message')
        .send-icon.disabled(id='sendIcon')
else
  .plug Выберите чат чтобы отправить сообщение`;

export class MessagesWindowComponent extends Block<MessagesWindowProps> {
  messageComponents: MessageComponent[] = [];

  constructor(props) {
    super('section', props);
  }

  render() {
    return this.compile(template, this.props);
  }

  addEvents() {
    document.getElementById('messageInput').addEventListener('input', event => {
      if (event.target.value) {
        document.getElementById('sendIcon').classList.remove('disabled');
      } else {
        document.getElementById('sendIcon').classList.add('disabled');
      }
    });
  }
}

