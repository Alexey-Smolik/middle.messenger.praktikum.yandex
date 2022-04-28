import {Block, Event} from '../../components/block';
import './login.component.scss';
import { FormFieldComponent } from '../../components/form-field/form-field.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { AuthService, SigninData } from '../../services/api/auth.service';
import store from '../../services/store/store.service';

interface LoginProps {
  loginField?: FormFieldComponent;
  passwordField?: FormFieldComponent;
  loader?: LoaderComponent | null;
  classForRoot?: string;
  isLoading?: boolean;
}

const template = `if isLoading
  != loader
else
  .login-wrapper__main-container
    .wrapper__header
      p Войти
    form(id='loginForm', class='form')
      .fields
        != loginField
        != passwordField
      button(id='loginButton' class='submit-btn primary-btn', type='button') Авторизоваться
    .login-wrapper__footer
      a(href='/sign-up') Нет аккаунта?`;

export class LoginComponent extends Block<LoginProps> {
  authService = new AuthService();
  loginField: FormFieldComponent;
  passwordField: FormFieldComponent;

  loginFieldsValues = {
    loginFieldValue: '',
    passwordFieldValue: ''
  };

  constructor(props: LoginProps) {
    super('div', {
      ...props,
      loader: new LoaderComponent({ classForRoot: 'loading' }),
      isLoading: true
    });

    this.prepareInitChildren();
  }

  render() {
    return this.compile(template, this.props);
  }

  private initComponentEvents() {
    this.getContent().querySelector('#loginButton')?.addEventListener('click', () => {
      if ([this.loginField, this.passwordField].map(
        field => this.validateField(field)
      ).every(validation => validation)) {
        const data: SigninData = {
            login: this.loginFieldsValues.loginFieldValue,
            password: this.loginFieldsValues.passwordFieldValue
        }

        this.authService.signIn(data).then(() => {
          window.location = '/messenger';
        });
      }
    });
  }

  private prepareInitChildren() {
    this.authService.getUserInfo().then(res => {
      if (res) {
        store.set('user', JSON.parse(res.data));
        window.location = '/messenger';
      } else {
        this.initChildren();
      }
    }).catch(() => this.initChildren());
  }

  private initChildren() {
    this.loginField = new FormFieldComponent({
      id: 'login',
      name: 'login',
      type: 'text',
      validationFieldId: 'loginError',
      labelText: 'Логин',
      errorText: 'Неверный логин',
      regexp: /(?=.*[a-zA-Z-_])[a-zA-z0-9-_]{3,20}$/,
      classForRoot: 'field',
      fieldValue: '',
      showErrorText: false,
    });

    this.loginField.setProps(this.getFieldEvents(this.loginField));

    this.passwordField = new FormFieldComponent({
      id: 'password',
      name: 'password',
      type: 'password',
      validationFieldId: 'passwordError',
      labelText: 'Пароль',
      errorText: 'Неверный пароль',
      regexp: /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,40}$/,
      classForRoot: 'field',
      fieldValue: '',
      showErrorText: false,
    });

    this.passwordField.setProps(this.getFieldEvents(this.passwordField));

    this.children.loginField = this.loginField;
    this.children.passwordField = this.passwordField;
    delete this.children.loader;

    this.setProps({
      isLoading: false,
      loader: null,
      loginField: this.children.loginField,
      passwordField: this.children.passwordField
    });

    this.initComponentEvents();
  }

  private getFieldEvents(field: FormFieldComponent): { events: Event[] } {
    return {
     events: [{
       name: 'blur',
       fieldId: field.props.id || '',
       callback: () => this.validateField(field)
     }, {
       name: 'input',
       fieldId: field.props.id || '',
       callback: event => this.loginFieldsValues[`${field.props.name}FieldValue`] = event.target.value
     }]
   };
  }

  private validateField(field: FormFieldComponent): boolean {
    const fieldValue = this.loginFieldsValues[`${field.props.name}FieldValue`];
    const isValid = field.props.regexp?.test(fieldValue);

    field.setProps({ showErrorText: !isValid, fieldValue: fieldValue });

    return isValid as boolean;
  }
}
