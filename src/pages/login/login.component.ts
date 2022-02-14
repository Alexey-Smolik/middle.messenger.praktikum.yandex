import { Block } from '../../components/block';
import './login.component.scss';
import { FormFieldComponent } from '../../components/form-field/form-field.component';

interface LoginProps {
  loginField?: FormFieldComponent;
  passwordField?: FormFieldComponent;
  classForRoot: string;
}

const template = `.login-wrapper__main-container
  .wrapper__header
    p Войти
  form(id='loginForm', class='form')
    .fields
      if loginField
        each field in loginField
          != field
      if passwordField
        each field in passwordField
          != field
    button(id='loginButton' class='submit-btn primary-btn', type='button') Авторизоваться
  .login-wrapper__footer
    a(href='#') Нет аккаунта?`;

export class LoginComponent extends Block<LoginProps> {
  loginField: FormFieldComponent[];
  passwordField: FormFieldComponent[];
  loginFieldValue = '';
  passwordFieldValue = '';

  constructor(props: LoginProps) {
    super('div', props)
    this.initChildren();
    this.initChildrenEvents();
    this.initComponentEvents();
  }

  render() {
    return this.compile(template, this.props);
  }

  private initChildrenEvents() {
    [this.loginField, this.passwordField].forEach((field, index) => {
      const inputField = field[0].getContent().querySelector(`#${field[0].props.id}`);

      inputField.addEventListener('blur', event => {
        this.validateField(
          field[0].getContent().querySelector(`#${field[0].props.validationFieldId}`),
          field[0].props,
          event?.target?.value
        );
      });

      inputField.addEventListener('input', event => {
        if (index === 0) {
          this.loginFieldValue = event.target.value;
        } else {
          this.passwordFieldValue = event.target.value;
        }
      });
    });
  }

  private initComponentEvents() {
    this.getContent().querySelector('#loginButton').addEventListener('click', () => {
      if ([this.loginField, this.passwordField].map((field, index) => {
        return this.validateField(
          field[0].getContent().querySelector(`#${field[0].props.validationFieldId}`),
          field[0].props,
          index === 0 ? this.loginFieldValue : this.passwordFieldValue
        );
      }).every(validation => validation)) {
        console.log({ login: this.loginFieldValue, password: this.passwordFieldValue })
      }
    });
  }

  private initChildren() {
    this.loginField = [
      new FormFieldComponent({
        id: 'login',
        name: 'login',
        type: 'text',
        validationFieldId: 'loginError',
        labelText: 'Логин',
        errorText: 'Неверный логин',
        regexp: /(?=.*[a-zA-Z-_])[a-zA-z0-9-_]{3,20}$/,
        classForRoot: 'field',
      })
    ];

    this.passwordField = [
      new FormFieldComponent({
        id: 'password',
        name: 'password',
        type: 'password',
        validationFieldId: 'passwordError',
        labelText: 'Пароль',
        errorText: 'Неверный пароль',
        regexp: /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,40}$/,
        classForRoot: 'field',
      })
    ];

    this.children.loginField = this.loginField;
    this.children.passwordField = this.passwordField;

    this.setProps({
      ...this.props,
      loginField: this.children.loginField,
      passwordField: this.children.passwordField,
    })
  }

  private validateField(validationField: HTMLElement, fieldProps, value: string): boolean {
    if (fieldProps.regexp.test(value)) {
      validationField.innerHTML = '';
      validationField.style.display = 'none';

      return true;
    }

    validationField.innerHTML = fieldProps.errorText;
    validationField.style.display = 'block';

    return false;
  }
}
