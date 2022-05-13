import './add-user.component.scss';
import { Block, Event } from '../../../components/block';
import { FormFieldComponent } from '../../../components/form-field/form-field.component';
import { UsersService } from '../../../services/api/users.service';
import { AddDeleteChatUsersParams, ChatsService } from '../../../services/api/chats.service';

interface AddUserProps {
    classForRoot?: string;
    chatId?: number;
    loginField?: FormFieldComponent;
    deleteMode?: boolean;
    closeWindow?: () => void;
    errorText?: string;
}

const template = `.modal-window
    .modal-window__wrapper
        if deleteMode
            .header Удалить пользователя
        else
            .header Добавить пользователя
        .main-content
            form
                != loginField
            if loginField
                p(class='error-text') #{errorText}
        .footer
            if deleteMode
                button(id='addButton' class='primary-btn', type='button') Удалить
            else
                button(id='addButton' class='primary-btn', type='button') Добавить
            span(id='cancelButton', class='footer__cancel') Отменить`;

export class AddUserComponent extends Block<AddUserProps> {
    loginField: FormFieldComponent;
    loginFieldValue = '';
    usersService = new UsersService();
    chatsService = new ChatsService();

    constructor(props) {
        super('section', props);
        this.initChildren();
    }

    render() {
        return this.compile(template, this.props);
    }

    private initComponentEvents() {
        const content = this.getContent();

        content.querySelector('#cancelButton')?.addEventListener('click', () => {
            this.props.closeWindow();
        });

        content.querySelector('#addButton')?.addEventListener('click', () => {
            if (this.validateField()) {
                this.usersService.searchUsersByLogin(this.loginFieldValue).then(res => {
                    const user = JSON.parse(res.data)[0];

                    if (user) {
                        const data: AddDeleteChatUsersParams = {
                            chatId: this.props.chatId as number,
                            users: [user.id]
                        }

                        return this.props.deleteMode ? this.chatsService.deleteUsersFromChat(data) : this.chatsService.addUsersToChat(data);
                    }

                    return null;
                }).then(res => {
                    if (res === null) {
                        this.children.loginField.setProps({ fieldValue: '' });
                        this.setProps({ errorText: 'Нет пользователя с таким логином' });
                        this.initComponentEvents();
                    } else {
                        this.props.closeWindow();
                    }
                });
            }
        });
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

        this.loginField.setProps(this.getFieldEvents());
        this.children.loginField = this.loginField;

        this.setProps({
            loginField: this.loginField
        });

        this.initComponentEvents();
    }

    private getFieldEvents(): { events: Event[] } {
        return {
            events: [{
                name: 'blur',
                fieldId: this.loginField.props.id || '',
                callback: () => this.validateField()
            }, {
                name: 'input',
                fieldId: this.loginField.props.id || '',
                callback: event => this.loginFieldValue = event.target.value
            }]
        };
    }

    private validateField(): boolean {
        const fieldValue = this.loginFieldValue;
        const isValid = this.loginField.props.regexp?.test(fieldValue);

        this.loginField.setProps({ showErrorText: !isValid, fieldValue: fieldValue });

        return isValid as boolean;
    }
}

