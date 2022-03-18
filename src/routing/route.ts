export class Route {
    private _pathname: string;
    private _blockClass: any;
    private _block: null;
    private _props: any;
    private _params: any;

    constructor(pathname: string, view: any, params: any, props: any) {
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

function render(query: string, block: any) {
    const root = document.querySelector(query);
    root?.appendChild(block.getContent());

    return root;
}
