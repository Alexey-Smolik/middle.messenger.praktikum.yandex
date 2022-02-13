import { Block } from '../../components/block';
import './server-error.component.scss';

interface ServerErrorProps {
  classForRoot: string;
}

const template = `.server-error-wrapper__main-container
  p(class='main-text') 500
  .additional-text
    p Мы уже фиксим
    a(href='../chats/chats.pug') Назад к чатам`;

export class ServerErrorComponent extends Block<ServerErrorProps> {
  constructor(props: ServerErrorProps) {
    super('div', props)
  }

  render() {
    return this.compile(template, this.props);
  }
}