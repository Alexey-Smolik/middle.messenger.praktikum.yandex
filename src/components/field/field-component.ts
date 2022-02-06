import {Block} from "../block";

const template = `label(for='email') Почта
        input(type='text', name='email', id='email')`;

export class FieldComponent extends Block {
  constructor(props) {
    super('section', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}

