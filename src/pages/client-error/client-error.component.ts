import { Block } from '../../components/block';
import './client-error.component.scss';

interface ClientErrorProps {
  classForRoot: string;
}

const template = `.client-error-wrapper__main-container
  p(class='main-text') 404
  .additional-text
    p Не туда попали
    a(href='../chats/chats.pug') Назад к чатам`;

export class ClientErrorComponent extends Block<ClientErrorProps> {
  constructor(props: ClientErrorProps) {
    super('div', props)
  }

  render() {
    return this.compile(template, this.props);
  }
}
