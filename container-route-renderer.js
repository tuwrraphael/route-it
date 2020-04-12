export class ContainerRouteRenderer {
    constructor(container) {
        this._currentComponent = null;
        this._container = container;
    }
    render(component) {
        if (component) {
            if (this._currentComponent) {
                this._container.innerHTML = "";
            }
            this._container.appendChild(component);
            this._currentComponent = true;
        }
    }
}