import { Block } from '../../components/block';
import './profile.component.scss';
import { FormFieldComponent } from '../../components/form-field/form-field.component';

interface ProfileProps {
  emailField?: FormFieldComponent[];
  loginField?: FormFieldComponent[];
  firstNameField?: FormFieldComponent[];
  secondNameField?: FormFieldComponent[];
  displayNameField?: FormFieldComponent[];
  phoneField?: FormFieldComponent[];
  classForRoot: string;
}

interface ProfileFields {
  emailField: FormFieldComponent[];
  loginField: FormFieldComponent[];
  firstNameField: FormFieldComponent[];
  secondNameField: FormFieldComponent[];
  displayNameField: FormFieldComponent[];
  phoneField: FormFieldComponent[];
}

const template = `.profile-wrapper__left-panel
  .icon
.profile-wrapper__main-panel
  .container
    .header
      p Алексей
    .main-content
      form(id='profileForm', class='form')
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
        if displayNameField
          each field in displayNameField
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

  get changeDataBtn() {
    return this.getContent().querySelector('#changeDataBtn');
  }

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

  private initChildrenEvents() {
   Object.keys(this.fields).forEach(key => {
      const inputField = this.fields[key][0].getContent().querySelector(`#${this.fields[key][0].props.id}`);

      inputField.addEventListener('blur', event => {
        this.validateField(
          this.fields[key][0].getContent().querySelector(`#${this.fields[key][0].props.validationFieldId}`),
          this.fields[key][0].props,
          event?.target?.value
        );
      });

      inputField.addEventListener('input', event => {
        this.profileFieldsValues[`${event.target.name}FieldValue`] = event.target.value;
      });
    });
  }

  private initComponentEvents() {
    this.changeDataBtn?.addEventListener('click', () => {
      this.saveBtnContainer.style.display = 'block';
      this.footer.style.display = 'none';

      Object.keys(this.fields).forEach(key => {
        this.fields[key][0].setProps({ disabled: false });
      });

      this.initChildrenEvents();
    });

    this.getContent().querySelector('#saveBtn')?.addEventListener('click', () => {
      this.footer.style.display = 'block';
      this.saveBtnContainer.style.display = 'none';

      if (Object.keys(this.fields).map(key => {
        return this.validateField(
          this.fields[key][0].getContent().querySelector(`#${this.fields[key][0].props.validationFieldId}`),
          this.fields[key][0].props,
          this.profileFieldsValues[`${this.fields[key][0].props.name}FieldValue`]
        );
      }).every(validation => validation)) {
        console.log(this.profileFieldsValues);
      }
    });
  }

  private initChildren() {
    this.fields = {
      emailField: [
        new FormFieldComponent({
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
        })
      ],
      loginField: [
        new FormFieldComponent({
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
        })
      ],
      firstNameField: [
        new FormFieldComponent({
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
        })
      ],
      secondNameField: [
        new FormFieldComponent({
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
        })
      ],
      displayNameField: [
        new FormFieldComponent({
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
        })
      ],
      phoneField: [
        new FormFieldComponent({
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
      ]
    };

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
