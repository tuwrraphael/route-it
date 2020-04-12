Dead simple vanilla js single page router

## Usage
Configure the `<base href="/simple/">`.

Create a route resolver for your application.
The resolver maps the paths under the base href and returns HTML Elements, which are then used as pages.
~~~js
        class MyApplicationRouteResolver {
            resolve(lastRoute, currentRoute, router) {
                switch (currentRoute) {
                    case "page1-div": // route /simple/page1-div
                        let div = document.createElement("div");
                        ...
                        return div;
                    case "page2-webcomponent": // route /page2-webcomponent
                        let component = new SomeFancyComponent();
                        return component;
                    case "":
                        return homePage;
                    default:
                        return false;
                }
            }
        }
~~~
Create the router and assign the route resolver and a __route renderer__.
The route renderer receives the element returned by the resolver and, e.g. adds it to the dom.
There are two route renderers available:
* `BodyChildRouteRenderer`: Accepts HTMLElement and places them as child of the body
* `ContainerRouteRenderer`: Accepts HTMLElement and places inside a container element, which is handed via constructor parameter

~~~js
new Router(new MyApplicationRouteResolver(), new BodyChildRouteRenderer())
    .run();
~~~

## Examples
* [Simple two pages](./simple/index.html)
* [Top navbar](./constant-nav/index.html)
* [Parsing path parameters](./path-parameter/index.html)