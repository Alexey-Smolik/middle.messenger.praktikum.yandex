import './create-chat.component.scss';
import { Block, Event } from '@components/block';
import { FormFieldComponent } from '@components/form-field/form-field.component';
import { ChatsService } from '@api/chats.service';

interface CreateChatProps {
    classForRoot?: string;
    chatNameField?: FormFieldComponent;
    closeWindow?: (withUpdate: boolean) => void;
}

const template = `.modal-window
    .modal-window__wrapper
        .header Создать чат
        .main-content
            form
                != chatNameField
        .footer
            button(id='createButton' class='create-chat primary-btn', type='button') Создать
            span(id='cancelButton', class='cancel') Отменить`;

export class CreateChatComponent extends Block<CreateChatProps> {
    chatsService = new ChatsService();
    chatNameField: FormFieldComponent;
    chatNameFieldValue = '';

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
            this.props.closeWindow(false);
        });

        content.querySelector('#createButton')?.addEventListener('click', () => {
            if (this.validateField()) {
                this.chatsService.createChat(this.chatNameFieldValue).then(() => {
                    this.props.closeWindow(true);
                }).catch(err => console.log(err));
            }
        });
    }

    private initChildren() {
       this.chatNameField = new FormFieldComponent({
            id: 'title',
            name: 'title',
            type: 'text',
            validationFieldId: 'titleError',
            labelText: 'Название чата',
            errorText: 'Невалидное название',
            regexp: /^[\sa-zа-я-A-ZА-Я0-9]{1,20}$/,
            classForRoot: 'field',
            fieldValue: '',
            showErrorText: false,
        });

        this.chatNameField.setProps(this.getFieldEvents());
        this.children.chatNameField = this.chatNameField;

        this.setProps({
            chatNameField: this.chatNameField
        });

        this.initComponentEvents();
    }

    private getFieldEvents(): { events: Event[] } {
        return {
            events: [{
                name: 'blur',
                fieldId: this.chatNameField.props.id || '',
                callback: () => this.validateField()
            }, {
                name: 'input',
                fieldId: this.chatNameField.props.id || '',
                callback: event => this.chatNameFieldValue = event.target.value
            }]
        };
    }

    private validateField(): boolean {
        const fieldValue = this.chatNameFieldValue;
        const isValid = this.chatNameField.props.regexp?.test(fieldValue);

        this.chatNameField.setProps({ showErrorText: !isValid, fieldValue: fieldValue });

        return isValid as boolean;
    }
}

