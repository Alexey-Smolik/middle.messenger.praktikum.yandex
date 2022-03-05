import {Block, Event} from '../../components/block';
import './profile.component.scss';
import { FormFieldComponent } from '../../components/form-field/form-field.component';

interface ProfileProps {
  emailField?: FormFieldComponent;
  loginField?: FormFieldComponent;
  firstNameField?: FormFieldComponent;
  secondNameField?: FormFieldComponent;
  displayNameField?: FormFieldComponent;
  phoneField?: FormFieldComponent;
  classForRoot: string;
}

interface ProfileFields {
  emailField: FormFieldComponent;
  loginField: FormFieldComponent;
  firstNameField: FormFieldComponent;
  secondNameField: FormFieldComponent;
  displayNameField: FormFieldComponent;
  phoneField: FormFieldComponent;
}

const template = `.profile-wrapper__left-panel
  .icon
.profile-wrapper__main-panel
  .container
    .header
      p Алексей
    .main-content
      form(id='profileForm', class='form')
        != emailField
        != loginField
        != firstNameField
        != secondNameField
        != displayNameField
        != phoneField
        != passwordField
        != password2Field 
      .footer(id='footer')
        .footer-link
          a(id='changeDataBtn', href='#') Изменить данные
        .footer-link
          a(href='#') Изменить пароль
        .footer-link
          a(href='#') Выйти

      .save-button-container(id='saveBtnContainer')
        button(id='saveBtn' class='primary-btn', type='button') Сохранить`;

export class ProfileComponent extends Block<ProfileProps> {
  fields: ProfileFields;
  profileFieldsValues = {
    emailFieldValue: '',
    loginFieldValue: '',
    firstNameFieldValue: '',
    secondNameFieldValue: '',
    displayNameFieldValue: '',
    phoneFieldValue: '',
  };

  get saveBtnContainer() {
    return this.getContent().querySelector('#saveBtnContainer');
  }

  get footer() {
    return this.getContent().querySelector('#footer');
  }

  constructor(props: ProfileProps) {
    super('div', props);

    this.initChildren();
    this.initComponentEvents();
  }

  render() {
    return this.compile(template, this.props);
  }

  private initComponentEvents() {
    this.getContent().querySelector('#changeDataBtn').addEventListener('click', () => {
      this.saveBtnContainer.style.display = 'block';
      this.footer.style.display = 'none';

      Object.keys(this.fields).forEach(key => {
        this.fields[key].setProps({ disabled: false });
      });
    });

    this.getContent().querySelector('#saveBtn')?.addEventListener('click', () => {
      this.footer.style.display = 'block';
      this.saveBtnContainer.style.display = 'none';

      if (Object.keys(this.fields).map(
        key => this.validateField(this.fields[key])
      ).every(validation => validation)) {
        console.log(this.profileFieldsValues);
      }
    });
  }

  private initChildren() {
    this.fields = {
      emailField: new FormFieldComponent({
        id: 'email',
        name: 'email',
        type: 'text',
        validationFieldId: 'emailError',
        labelText: 'Почта',
        errorText: 'Некорректный email',
        regexp: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        classForRoot: 'field',
        wrapField: true,
        disabled: true,
      }),
      loginField: new FormFieldComponent({
        id: 'login',
        name: 'login',
        type: 'text',
        validationFieldId: 'loginError',
        labelText: 'Логин',
        errorText: 'Некорректный логин',
        regexp: /(?=.*[a-zA-Z-_])[a-zA-z0-9-_]{3,20}$/,
        classForRoot: 'field',
        wrapField: true,
        disabled: true,
      }),
      firstNameField: new FormFieldComponent({
        id: 'firstName',
        name: 'firstName',
        type: 'text',
        validationFieldId: 'firstNameError',
        labelText: 'Имя',
        errorText: 'Некорректное имя',
        regexp: /^[A-ZА-Я][a-zа-я-]*$/,
        classForRoot: 'field',
        wrapField: true,
        disabled: true,
      }),
      secondNameField: new FormFieldComponent({
        id: 'secondName',
        name: 'secondName',
        type: 'text',
        validationFieldId: 'secondNameError',
        labelText: 'Фамилия',
        errorText: 'Некорректная фамилия',
        regexp: /^[A-ZА-Я][a-zа-я-]*$/,
        classForRoot: 'field',
        wrapField: true,
        disabled: true,
      }),
      displayNameField: new FormFieldComponent({
        id: 'displayName',
        name: 'displayName',
        type: 'text',
        validationFieldId: 'displayNameError',
        labelText: 'Имя в чате',
        errorText: 'Некорректное имя',
        regexp: /^[a-zа-я-A-ZА-Я]{1,10}$/,
        classForRoot: 'field',
        wrapField: true,
        disabled: true,
      }),
      phoneField: new FormFieldComponent({
        id: 'phone',
        name: 'phone',
        type: 'text',
        validationFieldId: 'phoneError',
        labelText: 'Телефон',
        errorText: 'Неверный телефон',
        regexp: /^(\+)?\d{5,15}$/,
        classForRoot: 'field',
        wrapField: true,
        disabled: true,
      })
    };

    this.fields.emailField.setProps(this.getFieldEvents(this.fields.emailField));
    this.fields.loginField.setProps(this.getFieldEvents(this.fields.loginField));
    this.fields.firstNameField.setProps(this.getFieldEvents(this.fields.firstNameField));
    this.fields.secondNameField.setProps(this.getFieldEvents(this.fields.secondNameField));
    this.fields.displayNameField.setProps(this.getFieldEvents(this.fields.displayNameField));
    this.fields.phoneField.setProps(this.getFieldEvents(this.fields.phoneField));

    this.children.emailField = this.fields.emailField;
    this.children.loginField = this.fields.loginField;
    this.children.firstNameField = this.fields.firstNameField;
    this.children.secondNameField = this.fields.secondNameField;
    this.children.displayNameField = this.fields.displayNameField;
    this.children.phoneField = this.fields.phoneField;

    this.setProps({
      ...this.props,
      emailField: this.children.emailField,
      loginField: this.children.loginField,
      firstNameField: this.children.firstNameField,
      secondNameField: this.children.secondNameField,
      displayNameField: this.children.displayNameField,
      phoneField: this.children.phoneField,
    })
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
        callback: event => this.profileFieldsValues[`${field.props.name}FieldValue`] = event.target.value
      }]
    };
  }

  private validateField(field: FormFieldComponent): boolean {
    const fieldValue = this.profileFieldsValues[`${field.props.name}FieldValue`];
    const isValid = field.props.regexp?.test(fieldValue);

    field.setProps({ showErrorText: !isValid, fieldValue: fieldValue });

    return isValid as boolean;
  }
}
