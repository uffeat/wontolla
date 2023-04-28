import {onhashchange, routes} from './router.js'

routes.add("home", (kwargs, ...args) => {
  console.log(`home route running with kwargs '${kwargs}' and args '${args}'.`);
});

routes.add("about", (kwargs, ...args) => {
  console.log(
    `about route running with kwargs '${kwargs}' and args '${args}'.`
  );
});


// Set up `onhashchange` AFTER setting up routes.
window.onhashchange = onhashchange;
onhashchange();