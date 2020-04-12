import { RouteRenderer } from "./router";

export class ContainerRouteRenderer implements RouteRenderer<HTMLElement | DocumentFragment> {
    private currentComponent: boolean = false;
    constructor(private container: HTMLElement) {
    }
    render(component: HTMLElement | DocumentFragment) {
        if (component) {
            if (this.currentComponent) {
                this.container.innerHTML = "";
            }
            this.container.appendChild(component);
            this.currentComponent = true;
        }
    }
}