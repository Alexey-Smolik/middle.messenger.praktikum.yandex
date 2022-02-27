import {Block, Event} from '../block';

export interface FormFieldProps {
  id?: string;
  type?: string;
  validationFieldId?: string
  labelText?: string;
  name?: string;
  classForRoot?: string;
  errorText?: string;
  regexp?: RegExp;
  wrapField?: boolean;
  disabled?: boolean;
  showErrorText?: boolean;
  fieldValue?: string;
  events?: Event[];
}

const template = `label(for=id) #{labelText}
if wrapField
  .input
    input(type=type, id=id, name=name, value=fieldValue, disabled=disabled)
    if showErrorText
      p(id=validationFieldId, class='error-text') #{errorText}
else 
  input(type=type, id=id, name=name, value=fieldValue, disabled=disabled)
  if showErrorText
    p(id=validationFieldId, class='error-text') #{errorText}`;

export class FormFieldComponent extends Block<FormFieldProps> {
  constructor(props: FormFieldProps) {
    super('div', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}
