export interface RouteResolver<T> {
    resolve(lastRoute: string, currentRoute: string, router: Router<any>): T | false;
}

export interface AsyncRouteResolver<T> {
    resolve(lastRoute: string, currentRoute: string, router: Router<any>): Promise<T | false>;
}

export interface RouteRenderer<T> {
    render(component: T): void;
}

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
        this.doRouting(window.location.pathname);
    }

    run() {
        let baseElement = document.querySelector("base");
        this.basePrefix = baseElement.getAttribute("href");
        this.baseHref = baseElement.href;
        window.addEventListener("popstate", this.popStateListener);
        this.doRouting(window.location.pathname);
    }

    destroy() {
        window.removeEventListener("popstate", this.popStateListener);
    }

    private doRouting(pathname: string): Promise<boolean> {
        let currentRoute = this.getRoute(pathname);
        return Promise.resolve(this.routeResolver.resolve(this.lastRoute, currentRoute, this))
            .then(resolved => {
                if (resolved) {
                    this.routeRenderer.render(resolved);
                    this.lastRoute = currentRoute;
                    return true;
                }
                return false;
            });
    }

    private getRoute(pathname: string) {
        let exactBaseHrefMatch = pathname === this.baseHref;
        let startsWithBase = pathname.substr(0, this.basePrefix.length) === this.basePrefix;
        return exactBaseHrefMatch ? '/' : startsWithBase ? pathname.substring(this.basePrefix.length) : pathname;
    }

    navigate(relative: string, title: string, replace?: boolean) {
        let url = new URL(relative, this.baseHref);
        this.doRouting(url.pathname).then(resolved => {
            if (resolved) {
                if (replace) {
                    window.history.replaceState({}, title || document.title, url.href);
                } else {
                    window.history.pushState({}, title || document.title, url.href);
                }
            }
        });
    }
}