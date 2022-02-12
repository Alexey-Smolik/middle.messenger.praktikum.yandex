import { Block } from '../block';

export interface FormFieldProps {
  id: string;
  type: string;
  validationFieldId?: string
  labelText?: string;
  name: string;
  classForRoot?: string;
  errorText?: string;
  regexp?: RegExp;
  wrapField?: boolean;
  disabled?: boolean;
}

const template = `label(for=id) #{labelText}
if wrapField
  .input
    input(type=type, id=id, name=name, disabled=disabled)
    p(id=validationFieldId, class='error-text') #{errorText}
else 
  input(type=type, id=id, name=name)
  p(id=validationFieldId, class='error-text') #{errorText}`;

export class FormFieldComponent extends Block {
  constructor(props: FormFieldProps) {
    super('div', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}
