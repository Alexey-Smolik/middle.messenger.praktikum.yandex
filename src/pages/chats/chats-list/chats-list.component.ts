import { Block } from '../../../components/block';
import './chat-list.component.scss';
import { Chat } from '../../../types/chat.type';

interface ChatsListProps {
  chats: Chat[];
  click: (id: number) => void;
}

const template = `each chat in chats
  .chat-wrapper(data-id=chat.id)
    if chat.avatar
      img(class='avatar', id='imgPlug', src=chat.avatar)
    else
      .img-plug
    .msg-info
        if chat.last_message
          .info
            p.name #{chat.title}
            span.time #{chat.last_message.time}
          div.msg
              p.msg__text
                  if isSentMessage
                      span Вы: 
                  span.main #{chat.last_message.content}
              if count > 0
                  .count
                      div #{chat.unread_count}
        else
          .info
            p.name #{chat.title}`;

export class ChatsListComponent extends Block<ChatsListProps> {
  constructor(props) {
    super('section', props);
    this.initComponentEvents();
  }

  render() {
    return this.compile(template, this.props);
  }

  initComponentEvents() {
    Array.from(this.getContent().getElementsByClassName('chat-wrapper')).forEach(chat => {
      chat.addEventListener('click', () => {
        this.props.click(+chat.dataset.id);
      });
    });
  }
}

