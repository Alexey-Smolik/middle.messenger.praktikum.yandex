import {Block} from '../../../../components/block';

interface MessageProps {
  text: string;
  date: Date;
  isSentMessage: boolean;
  classForRoot?: string;
}

const template = `.message(class=isSentMessage ? 'sent-msg' : 'received-msg') #{text}
    span.message-time #{date.getHours()}:#{date.getMinutes()}`

export class MessageComponent extends Block<MessageProps> {
  constructor(props) {
    super('div', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}

