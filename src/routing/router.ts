import { Route } from './route';

export class Router {
    private routes: Route[];
    private history: History;
    private _currentRoute: Route | null
    private _rootQuery: string;
    private __instance;

    constructor(rootQuery: string) {
        if (Router.__instance) {
            return Router.__instance;
        }

        this.routes = [];
        this.history = window.history;
        this._currentRoute = null;
        this._rootQuery = rootQuery;

        Router.__instance = this;
    }

    use(pathname: string, block, props: any) {
        const route = new Route(pathname, block, props,{ rootQuery: this._rootQuery });
        this.routes.push(route);
        return this;
    }

    start() {
        window.onpopstate = event => {
            this._onRoute(event?.currentTarget?.location.pathname);
        };

        this._onRoute(window.location.pathname);
    }

    _onRoute(pathname: string) {
        const route = this.getRoute(pathname);

        if (this._currentRoute) {
            this._currentRoute.leave();
        }

        this._currentRoute = route;
        route?.render();
        // route.render(route, pathname);
    }

    go(pathname: string) {
        this.history.pushState({ }, '', pathname);
        this._onRoute(pathname);
    }

    back() {
        this.history.back();
    }

    forward() {
        this.history.forward();
    }

    getRoute(pathname: string): Route | null {
        return this.routes.find(route => route.match(pathname)) || null;
    }
}