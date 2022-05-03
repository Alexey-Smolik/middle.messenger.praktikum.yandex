import './confirm-window.component.scss';
import { Block } from '../block';

interface ConfirmWindowProps {
    classForRoot?: string;
    headerText?: string;
    confirmText?: string;
    confirmBtnText?: string;
    cancelBtnText?: string;
    errorText?: string;
    promiseForAccept?: () => Promise<object>;
    closeWindow?: (withUpdate: boolean) => void;
}

const template = `.modal-window
    .modal-window__wrapper
        .header #{headerText}
        .main-content
            span(class='confirm-text') #{confirmText}
        .error-text
            span #{errorText}
        .footer
            button(id='confirmButton' class='primary-btn', type='button') #{confirmBtnText}
            span(id='cancelButton', class='cancel') #{cancelBtnText}`;

export class ConfirmWindowComponent extends Block<ConfirmWindowProps> {
    constructor(props) {
        super('section', props);
        this.initComponentEvents();
    }

    render() {
        return this.compile(template, this.props);
    }

    private initComponentEvents() {
        const content = this.getContent();

        content.querySelector('#cancelButton')?.addEventListener('click', () => {
            this.props.closeWindow(false);
        });

        content.querySelector('#confirmButton')?.addEventListener('click', () => {
           this.props?.promiseForAccept().then(res => {
               if (res) {
                   this.props.closeWindow(true);
               } else {
                   this.setProps({ errorText: 'Что-то пошло не так' });
                   this.initComponentEvents();
               }
           })
        });
    }
}

