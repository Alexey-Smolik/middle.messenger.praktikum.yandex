import {Block} from '../../../components/block';

const template = `.chat-wrapper
    .img-plug
    .msg-info
        .info
            p.name #{name}
            span.time #{time}
        div.msg
            p.msg__text
                if isSentMessage
                    span Вы: 
                span.main #{msg}
            if count > 0
                .count
                    div #{count}`;

export class ChatComponent extends Block {
  constructor(props) {
    super('section', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}

