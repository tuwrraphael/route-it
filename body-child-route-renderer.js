export class BodyChildRouteRenderer {
    constructor() {
        this._currentComponent = null;
    }
    render(component) {
        if (component) {
            if (this._currentComponent) {
                document.body.removeChild(this._currentComponent);
            }
            document.body.appendChild(component);
            this._currentComponent = component;
        }
    }
}