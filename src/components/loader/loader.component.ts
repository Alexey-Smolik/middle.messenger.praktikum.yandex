import { Block } from '../block';
import './loader.component.scss';

export interface LoaderProps {
    classForRoot?: string;
}

const template = `.loader`;

export class LoaderComponent extends Block<LoaderProps> {
    constructor(props) {
        super('div', props);
    }

    render() {
        return this.compile(template, this.props);
    }
}
