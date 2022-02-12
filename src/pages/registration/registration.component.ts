import { Block } from '../../components/block';
import './registration.component.scss';
import { FormFieldComponent } from '../../components/form-field/form-field.component';

interface RegistrationProps {
  emailField?: FormFieldComponent[];
  loginField?: FormFieldComponent[];
  firstNameField?: FormFieldComponent[];
  secondNameField?: FormFieldComponent[];
  phoneField?: FormFieldComponent[];
  passwordField?: FormFieldComponent[];
  password2Field?: FormFieldComponent[];
  classForRoot: string;
}

const template = `.registration-wrapper__main-container
  .wrapper__header
    p Войти
  form(class='form')
    .fields
      if emailField
        each field in emailField
          != field
      if loginField
        each field in loginField
          != field
      if firstNameField
        each field in firstNameField
          != field
      if secondNameField
        each field in secondNameField
          != field
      if phoneField
        each field in phoneField
          != field    
      if passwordField
        each field in passwordField
          != field
      if password2Field
        each field in password2Field
          != field
    button(id='registerButton' class='submit-btn primary-btn', type='button') Зарегистрироваться
  .registration-wrapper__footer
    a(href='../login/login.pug') Войти`;

export class RegistrationComponent extends Block<RegistrationProps> {
  emailField: FormFieldComponent[];
  loginField: FormFieldComponent[];
  firstNameField: FormFieldComponent[];
  secondNameField: FormFieldComponent[];
  phoneField: FormFieldComponent[];
  passwordField: FormFieldComponent[];
  password2Field: FormFieldComponent[];

  registrationFieldsValues = {
    emailFieldValue: '',
    loginFieldValue: '',
    firstNameFieldValue: '',
    secondNameFieldValue: '',
    phoneFieldValue: '',
    passwordFieldValue: '',
    password2FieldValue: '',
  };

  constructor(props: RegistrationProps) {
    super('div', props)
    this.initChildren();
    this.initChildrenEvents();
    this.initComponentEvents();
  }

  render() {
    return this.compile(template, this.props);
  }

  private initChildrenEvents() {
    [
      this.emailField,
      this.loginField,
      this.firstNameField,
      this.secondNameField,
      this.phoneField,
      this.passwordField,
      this.password2Field,
    ].forEach(field => {
      const inputField = field[0].getContent().querySelector(`#${field[0].props.id}`);

      inputField.addEventListener('blur', event => {
        this.validateField(
          field[0].getContent().querySelector(`#${field[0].props.validationFieldId}`),
          field[0].props,
          event?.target?.value
        );
      });

      inputField.addEventListener('input', event => {
        this.registrationFieldsValues[`${event.target.name}FieldValue`] = event.target.value;
      });
    });
  }

  private initComponentEvents() {
    this.getContent().querySelector('#registerButton').addEventListener('click', () => {
      if ([
        this.emailField,
        this.loginField,
        this.firstNameField,
        this.secondNameField,
        this.phoneField,
        this.passwordField,
        this.password2Field,
      ].map(field => {
        return this.validateField(
          field[0].getContent().querySelector(`#${field[0].props.validationFieldId}`),
          field[0].props,
          this.registrationFieldsValues[`${field[0].props.name}FieldValue`]
        );
      }).every(validation => validation)) {
        console.log(this.registrationFieldsValues);
      }
    });
  }

  private initChildren() {
    this.emailField = [
      new FormFieldComponent({
        id: 'email',
        name: 'email',
        type: 'text',
        validationFieldId: 'emailError',
        labelText: 'Почта',
        errorText: 'Некорректный email',
        regexp: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        classForRoot: 'field',
      })
    ];

    this.loginField = [
      new FormFieldComponent({
        id: 'login',
        name: 'login',
        type: 'text',
        validationFieldId: 'loginError',
        labelText: 'Логин',
        errorText: 'Некорректный логин',
        regexp: /(?=.*[a-zA-Z-_])[a-zA-z0-9-_]{3,20}$/,
        classForRoot: 'field',
      })
    ];

    this.firstNameField = [
      new FormFieldComponent({
        id: 'firstName',
        name: 'firstName',
        type: 'text',
        validationFieldId: 'firstNameError',
        labelText: 'Имя',
        errorText: 'Некорректное имя',
        regexp: /^[A-ZА-Я][a-zа-я-]*$/,
        classForRoot: 'field',
      })
    ];

    this.secondNameField = [
      new FormFieldComponent({
        id: 'secondName',
        name: 'secondName',
        type: 'text',
        validationFieldId: 'secondNameError',
        labelText: 'Фамилия',
        errorText: 'Некорректная фамилия',
        regexp: /^[A-ZА-Я][a-zа-я-]*$/,
        classForRoot: 'field',
      })
    ];

    this.phoneField = [
      new FormFieldComponent({
        id: 'phone',
        name: 'phone',
        type: 'text',
        validationFieldId: 'phoneError',
        labelText: 'Телефон',
        errorText: 'Неверный телефон',
        regexp: /^(\+)?\d{5,15}$/,
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

    this.password2Field = [
      new FormFieldComponent({
        id: 'password2',
        name: 'password2',
        type: 'password',
        validationFieldId: 'password2Error',
        labelText: 'Пароль (ещё раз)',
        errorText: 'Пароли не совпадают',
        regexp: /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,40}$/,
        classForRoot: 'field',
      })
    ];

    this.children.emailField = this.emailField;
    this.children.loginField = this.loginField;
    this.children.firstNameField = this.firstNameField;
    this.children.secondNameField = this.secondNameField;
    this.children.phoneField = this.phoneField;
    this.children.passwordField = this.passwordField;
    this.children.password2Field = this.password2Field;

    this.setProps({
      ...this.props,
      emailField: this.children.emailField,
      loginField: this.children.loginField,
      firstNameField: this.children.firstNameField,
      secondNameField: this.children.secondNameField,
      phoneField: this.children.phoneField,
      passwordField: this.children.passwordField,
      password2Field: this.children.password2Field,
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
