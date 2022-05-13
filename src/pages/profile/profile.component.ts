import {Block, Event} from '../../components/block';
  import './profile.component.scss';
import { FormFieldComponent } from '../../components/form-field/form-field.component';
import { LoaderComponent } from "../../components/loader/loader.component";
import { AuthService } from '../../services/api/auth.service';
import { ChangePasswordData, UserData, UsersService } from '../../services/api/users.service';
import router from "../../../index";

interface ProfileProps {
  emailField?: FormFieldComponent;
  loginField?: FormFieldComponent;
  firstNameField?: FormFieldComponent;
  secondNameField?: FormFieldComponent;
  displayNameField?: FormFieldComponent;
  phoneField?: FormFieldComponent;
  oldPasswordField?: FormFieldComponent;
  newPasswordField?: FormFieldComponent;
  newPassword2Field?: FormFieldComponent;
  classForRoot?: string;
  loader?: LoaderComponent | null;
  isLoading?: boolean;
  avatar?: string;
  isPasswordEdit?: boolean
  isProfileEdit?: boolean;
}

interface ProfileFields {
  emailField: FormFieldComponent;
  loginField: FormFieldComponent;
  firstNameField: FormFieldComponent;
  secondNameField: FormFieldComponent;
  displayNameField: FormFieldComponent;
  phoneField: FormFieldComponent;
}

interface PasswordFields {
  oldPasswordField: FormFieldComponent;
  newPasswordField: FormFieldComponent;
  newPassword2Field: FormFieldComponent;
}

const template = `.profile-wrapper__left-panel(id='leftPanel')
  .icon
.profile-wrapper__main-panel
  if isLoading
    != loader
  else
    .container
      .header
        if avatar
          img(class='avatar', id='imgPlug', src=avatar)
        else
          .img-plug(id='imgPlug')
        input(type='file' id='avatar-input', accept='image/x-png,image/gif,image/jpeg')
        p Алексей
      .main-content
        form(id='profileForm', class='form')
          if isPasswordEdit
            != oldPasswordField
            != newPasswordField
            != newPassword2Field 
          else
            != emailField
            != loginField
            != firstNameField
            != secondNameField
            != displayNameField
            != phoneField
        if !isPasswordEdit && !isProfileEdit
          .footer(id='footer')
            .footer-link
              a(id='changeDataBtn') Изменить данные
            .footer-link
              a(id='changePassBtn') Изменить пароль
            .footer-link
              a(id='logoutLink') Выйти
        else
          .save-button-container(id='saveBtnContainer')
            button(id='saveBtn' class='primary-btn', type='button') Сохранить`;

const avatarUrl = 'https://ya-praktikum.tech/api/v2/resources';

export class ProfileComponent extends Block<ProfileProps> {
  authService = new AuthService();
  usersService = new UsersService();
  fields: ProfileFields;
  passwordFields: PasswordFields;

  profileFieldsValues = {
    emailFieldValue: '',
    loginFieldValue: '',
    firstNameFieldValue: '',
    secondNameFieldValue: '',
    displayNameFieldValue: '',
    phoneFieldValue: '',
  };

  passwordFieldsValues = {
    oldPasswordFieldValue: '',
    newPasswordFieldValue: '',
    newPassword2FieldValue: '',
  }

  avatarLink = '';

  get saveBtnContainer() {
    return this.getContent().querySelector('#saveBtnContainer');
  }

  get footer() {
    return this.getContent().querySelector('#footer');
  }

  constructor(props) {
    super('div', {
      ...props,
      loader: new LoaderComponent({ classForRoot: 'loading' }),
      isLoading: true,
    });

    this.initChildren();
  }

  render() {
    return this.compile(template, this.props);
  }

  private initComponentEvents() {
    const content = this.getContent();

    content.querySelector('#leftPanel')?.addEventListener('click', () => {
      router.go('/messenger');
    });

    content.querySelector('#logoutLink')?.addEventListener('click', () => {
      this.authService.logout().then(res => {
        if (res.ok) {
          router.go('/');
        }
      });
    });

    content.querySelector('#changeDataBtn')?.addEventListener('click', () => {
      Object.keys(this.fields).forEach(key => {
        this.fields[key].setProps({ disabled: false });
      });

      this.setProps({ isProfileEdit: true });
      this.initComponentEvents();
    });

    content.querySelector('#changePassBtn')?.addEventListener('click', () => {
      this.passwordFields = {
        oldPasswordField: new FormFieldComponent({
          id: 'oldPassword',
          name: 'oldPassword',
          type: 'password',
          validationFieldId: 'passwordError',
          labelText: 'Старый пароль',
          errorText: 'Невалидный пароль',
          regexp: /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,40}$/,
          classForRoot: 'field',
          wrapField: true,
          fieldValue: '',
          showErrorText: false,
        }),
        newPasswordField: new FormFieldComponent({
          id: 'newPassword',
          name: 'newPassword',
          type: 'password',
          validationFieldId: 'passwordError',
          labelText: 'Новый пароль',
          errorText: 'Невалидный пароль',
          regexp: /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,40}$/,
          classForRoot: 'field',
          wrapField: true,
          fieldValue: '',
          showErrorText: false,
        }),
        newPassword2Field: new FormFieldComponent({
          id: 'newPassword2',
          name: 'newPassword2',
          type: 'password',
          validationFieldId: 'passwordError',
          labelText: 'Повторите пароль',
          errorText: 'Невалидный пароль',
          regexp: /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,40}$/,
          classForRoot: 'field',
          wrapField: true,
          fieldValue: '',
          showErrorText: false,
        }),
      };

      this.passwordFields.oldPasswordField.setProps(this.getFieldEvents(this.passwordFields.oldPasswordField));
      this.passwordFields.newPasswordField.setProps(this.getFieldEvents(this.passwordFields.newPasswordField));
      this.passwordFields.newPassword2Field.setProps(this.getFieldEvents(this.passwordFields.newPassword2Field));

      this.children.oldPasswordField = this.passwordFields.oldPasswordField;
      this.children.newPasswordField = this.passwordFields.newPasswordField;
      this.children.newPassword2Field = this.passwordFields.newPassword2Field;

      this.setProps({
        isPasswordEdit: true,
        oldPasswordField: this.passwordFields.oldPasswordField,
        newPasswordField: this.passwordFields.newPasswordField,
        newPassword2Field: this.passwordFields.newPassword2Field
      });

      this.initComponentEvents();
    });

    content.querySelector('#saveBtn')?.addEventListener('click', () => {
      if (this.props.isPasswordEdit) {
        if (Object.keys(this.passwordFields).map(
            key => this.validateField(this.passwordFields[key])
        ).every(validation => validation)) {
          const data: ChangePasswordData = {
              oldPassword: this.passwordFieldsValues.oldPasswordFieldValue,
              newPassword: this.passwordFieldsValues.newPasswordFieldValue
          }

          this.usersService.changeUserPassword(data).then(() => {
            this.setProps({ isPasswordEdit: false });
            this.initComponentEvents();
          });
        }
      } else {
        if (Object.keys(this.fields).map(
            key => this.validateField(this.fields[key])
        ).every(validation => validation)) {
          const data: UserData = {
              first_name: this.profileFieldsValues.firstNameFieldValue,
              second_name: this.profileFieldsValues.secondNameFieldValue,
              display_name: this.profileFieldsValues.displayNameFieldValue,
              login: this.profileFieldsValues.loginFieldValue,
              email: this.profileFieldsValues.emailFieldValue,
              phone: this.profileFieldsValues.phoneFieldValue,
          }

          this.usersService.changeUserData(data).then(() => {
            Object.keys(this.fields).forEach(key => {
              this.fields[key].setProps({ disabled: true });
            });

            this.setProps({ isProfileEdit: false });
            this.initComponentEvents();
          });
        }
      }
    });

    const avatarInput = content.querySelector('#avatar-input');

    content.querySelector('#imgPlug')?.addEventListener('click', () => avatarInput.click());

    avatarInput?.addEventListener('change', () => {
      const formData = new FormData();
      formData.append('avatar', avatarInput.files[0]);

      this.usersService.changeUserAvatar(formData).then(res => {
        this.setProps({ avatar: avatarUrl + JSON.parse(res.data).avatar });
        this.initComponentEvents();
      });
    });
  }

  private initChildren() {
    this.authService.getUserInfo().then(res => {
      const data = JSON.parse(res.data);

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
          fieldValue: data.email,
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
          fieldValue: data.login,
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
          fieldValue: data.first_name,
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
          fieldValue: data.second_name,
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
          fieldValue: data.display_name || '',
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
          fieldValue: data.phone,
        })
      };

      this.profileFieldsValues.emailFieldValue = data.email || '';
      this.profileFieldsValues.loginFieldValue = data.login || '';
      this.profileFieldsValues.firstNameFieldValue = data.first_name || '';
      this.profileFieldsValues.secondNameFieldValue = data.second_name || '';
      this.profileFieldsValues.displayNameFieldValue = data.display_name || '';
      this.profileFieldsValues.phoneFieldValue = data.phone || '';

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
      delete this.children.loader;

      this.avatarLink = data.avatar ? avatarUrl + data.avatar : '';

      this.setProps({
        isLoading: false,
        loader: null,
        emailField: this.children.emailField,
        loginField: this.children.loginField,
        firstNameField: this.children.firstNameField,
        secondNameField: this.children.secondNameField,
        displayNameField: this.children.displayNameField,
        phoneField: this.children.phoneField,
        avatar: this.avatarLink,
      });

      this.initComponentEvents();
    });
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
        callback: event =>
            (
                this.props.isProfileEdit ? this.profileFieldsValues : this.passwordFieldsValues
            )[`${field.props.name}FieldValue`] = event.target.value
      }]
    };
  }

  private validateField(field: FormFieldComponent): boolean {
    const fieldValue = (
        this.props.isProfileEdit ? this.profileFieldsValues : this.passwordFieldsValues
    )[`${field.props.name}FieldValue`];
    const isValid = field.props.regexp?.test(fieldValue);

    field.setProps({ showErrorText: !isValid, fieldValue: fieldValue });

    return isValid as boolean;
  }
}
