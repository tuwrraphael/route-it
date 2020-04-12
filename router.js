export class Router {
    constructor(routeResolver, routeRenderer) {
        this._lastRoute = null;
        this._routeResolver = routeResolver;
        this._routeRenderer = routeRenderer;
        this._popStateListener = this._handlePopState.bind(this);
    }

    _handlePopState(e) {
        this._doRouting(window.location.pathname);
    }

    run() {
        let baseElement = document.querySelector("base");
        this._basePrefix = baseElement.getAttribute("href");
        this._baseHref = baseElement.href;
        window.addEventListener("popstate", this._popStateListener);
        this._doRouting(window.location.pathname);
    }

    destroy() {
        window.removeEventListener("popstate", this._popStateListener);
    }

    _doRouting(pathname) {
        let currentRoute = this._getRoute(pathname);
        let resolved = this._routeResolver.resolve(this._lastRoute, currentRoute, this);
        this._routeRenderer.render(resolved);
        this._lastRoute = currentRoute;
        return !!resolved;
    }

    _getRoute(pathname) {
        let exactBaseHrefMatch = pathname === this._baseHref;
        let startsWithBase = pathname.substr(0, this._basePrefix.length) === this._basePrefix;
        return exactBaseHrefMatch ? '/' : startsWithBase ? pathname.substring(this._basePrefix.length) : pathname;
    }

    navigate(relative, title) {
        let url = new URL(relative, this._baseHref);
        if (this._doRouting(url.pathname)) {
            window.history.pushState({}, title || document.title, url.href);
        }
    }
}