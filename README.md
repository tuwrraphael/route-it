# route-it
Dead simple no framework, vanilla js single page router.

[![NPM version](http://img.shields.io/npm/v/route-it)](https://npmjs.org/package/route-it)

This package brings a tiny basis for implementing spa routing to your application. It handles `<base href>`, `popstate` (back button) and switching pages/components.
You implement a method which resolves paths to plain HTML Elements or web components.

It depends on your applications needs how sophisticated that is. Sometimes a simple switchcase is enough, sometimes you might want to extract path & query parameters from the URL or even run async operations before resolving a component.

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
* Simple two pages [src](./simple/index.html) [demo](https://tuwrraphael.github.io/route-it/simple)
* Top navbar [src](./constant-nav/index.html) [demo](https://tuwrraphael.github.io/route-it/constant-nav)
* Parsing path parameters [src](./path-parameter/index.html) [demo](https://tuwrraphael.github.io/route-it/path-parameter)
* Async (for lazy chunks) [src](./simple/async.html) [demo](https://tuwrraphael.github.io/route-it/async)
