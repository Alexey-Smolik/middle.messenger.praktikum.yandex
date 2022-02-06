import {Block} from '../../../../components/block';

const template = `.message(class=isSentMessage ? 'sent-msg' : 'received-msg') #{text}
    span.message-time #{date.getHours()}:#{date.getMinutes()}`

export class MessageComponent extends Block {
  constructor(props) {
    super('div', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}

