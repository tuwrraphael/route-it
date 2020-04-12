import { RouteRenderer } from "./router";

export class BodyChildRouteRenderer implements RouteRenderer<HTMLElement> {
    private currentComponent: HTMLElement = null;
    constructor() {

    }
    render(component: HTMLElement) {
        if (component) {
            if (this.currentComponent) {
                document.body.removeChild(this.currentComponent);
            }
            document.body.appendChild(component);
            this.currentComponent = component;
        }
    }
}