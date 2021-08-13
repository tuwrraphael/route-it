export interface RouteResolver<T> {
    resolve(lastRoute: string, currentRoute: string, router: Router<any>): T | false;
}

export interface AsyncRouteResolver<T> {
    resolve(lastRoute: string, currentRoute: string, router: Router<any>): Promise<T | false>;
}

export interface RouteRenderer<T> {
    render(component: T): void;
}


type ResolveResult<T> = false | { resolved: T, currentRoute: string };

export class Router<T> {
    private lastRoute: string = null;
    private basePrefix: string;
    private baseHref: string;
    private popStateListener: (this: Window, ev: PopStateEvent) => any;

    constructor(private routeResolver: RouteResolver<T> | AsyncRouteResolver<T>,
        private routeRenderer: RouteRenderer<T>) {
        this.popStateListener = this.handlePopState.bind(this);
    }

    private handlePopState(ev: PopStateEvent) {
        this.resolve(window.location.pathname).then(resolveResult => this.render(resolveResult));
    }

    run() {
        let baseElement = document.querySelector("base");
        this.basePrefix = baseElement.getAttribute("href");
        this.baseHref = baseElement.href;
        window.addEventListener("popstate", this.popStateListener);
        this.resolve(window.location.pathname).then(resolveResult => this.render(resolveResult));
    }

    destroy() {
        window.removeEventListener("popstate", this.popStateListener);
    }

    private resolve(pathname: string): Promise<ResolveResult<T>> {
        let currentRoute = this.getRoute(pathname);
        return Promise.resolve(this.routeResolver.resolve(this.lastRoute, currentRoute, this)).then(resolved => {
            if (resolved) {
                return { resolved, currentRoute };
            }
            return false;
        });
    }

    private render(resolveResult: ResolveResult<T>) {
        if (resolveResult) {
            this.routeRenderer.render(resolveResult.resolved);
            this.lastRoute = resolveResult.currentRoute;
            return true;
        }
        return false;
    }

    private getRoute(pathname: string) {
        let exactBaseHrefMatch = pathname === this.baseHref;
        let startsWithBase = pathname.substr(0, this.basePrefix.length) === this.basePrefix;
        return exactBaseHrefMatch ? '/' : startsWithBase ? pathname.substring(this.basePrefix.length) : pathname;
    }

    navigate(relative: string, title: string, replace?: boolean) {
        let url = new URL(relative, this.baseHref);
        this.resolve(url.pathname).then(resolveResult => {
            if (resolveResult) {
                if (replace) {
                    window.history.replaceState({}, title || document.title, url.href);
                } else {
                    window.history.pushState({}, title || document.title, url.href);
                }
            }
            this.render(resolveResult);
        });
    }
}