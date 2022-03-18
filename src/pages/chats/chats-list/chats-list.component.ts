import { Block } from '../../../components/block';

interface ChatsListProps {
  chats: Chat[];
  click: (id: number) => void;
}

export interface Chat {
  id: number;
  last_message: string | null;
  title: string;
  unread_count: number;
  created_by: number;
  avatar: string;
}

const template = `each chat in chats
  .chat-wrapper(data-id=chat.id)
    if chat.avatar
      img(class='avatar', id='imgPlug', src=chat.avatar)
    else
      .img-plug
    .msg-info
        .info
            p.name #{chat.title}
            span.time #{chat.time}
        div.msg
            p.msg__text
                if isSentMessage
                    span Вы: 
                span.main #{chat.msg}
            if count > 0
                .count
                    div #{chat.count}`;

export class ChatsListComponent extends Block<ChatsListProps> {
  constructor(props: ChatsListProps) {
    super('section', props);
    this.initComponentEvents();
  }

  render() {
    return this.compile(template, this.props);
  }

  private initComponentEvents() {
    Array.from(this.getContent().getElementsByClassName('chat-wrapper')).forEach(chat => {
      chat.addEventListener('click', () => {
        this.props.click(+chat.dataset.id);
      });
    });

    // console.log();
    //
    // this.getContent().querySelector('.chat-wrapper').addEventListener('click', event => {
    //   console.log(event);
    //   this.props.click(1);
    // });
  }
}

