import {Block} from '../../../components/block';
import {MessageComponent} from './message/message.component';

const defaultTemplate = '.plug Выберите чат чтобы отправить сообщение';

const template = `.main-content-wrapper
    .header
        .wrapper
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
            .send-icon.disabled(id='sendIcon')`;

export class MessagesWindowComponent extends Block {
  messageComponents: MessageComponent[] = [];

  constructor(props) {
    super('section', props);
  }

  render() {
    if (this.props.selectedChat) {
      return this.compile(template, this.props);
    }

    return this.compile(defaultTemplate, this.props);
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

