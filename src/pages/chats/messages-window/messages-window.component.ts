import { Block } from '../../../components/block';
import { MessageModel } from '../mock-data';
import { Chat } from '../chats-list/chats-list.component';

interface MessagesWindowProps {
  selectedChat: Chat;
  messages: MessageModel[];
}

const template = `if selectedChat
  .main-content-wrapper
    .header
      .header-wrapper
        if selectedChat.avatar
          img(class='avatar', id='imgPlug', src=selectedChat.avatar)
        else
          .img-plug
        span.user-name #{selectedChat.title}
        .options-icon
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
  .plug Выберите чат чтобы отправить сообщение`;

export class MessagesWindowComponent extends Block<MessagesWindowProps> {
  constructor(props: MessagesWindowProps) {
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

