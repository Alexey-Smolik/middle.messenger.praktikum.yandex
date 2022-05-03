import { render } from '../utils/render';

export class Route {
    private _pathname: string;
    private _blockClass: never;
    private _block: null;
    private _props: never;
    private _params: never;

    constructor(pathname: string, view: never, params: never, props: never) {
        this._pathname = pathname;
        this._blockClass = view;
        this._block = null;
        this._props = props;
        this._params = params;
    }

    navigate(pathname: string) {
        if (this.match(pathname)) {
            this._pathname = pathname;
            this.render();
        }
    }

    leave() {
        if (this._block) {
            this._block.hide();
        }
    }

    match(pathname: string) {
        return isEqual(pathname, this._pathname);
    }

    render() {
        if (!this._block) {
            this._block = new this._blockClass(this._params);
            render(this._props.rootQuery, this._block);
            return;
        }

        this._block.show();
    }
}

function isEqual(lhs: string, rhs: string) {
    return lhs === rhs;
}
