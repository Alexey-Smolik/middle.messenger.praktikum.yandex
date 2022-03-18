import { Block } from '../block';
import './loader.component.css';

export interface LoaderProps {
    classForRoot?: string;
}

const template = `.loader`;

export class LoaderComponent extends Block<LoaderProps> {
    constructor(props: LoaderProps) {
        super('div', props);
    }

    render() {
        return this.compile(template, this.props);
    }
}
