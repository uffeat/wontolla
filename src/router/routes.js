import {onhashchange, routes} from './router.js'
import { component as home } from '../pages/home.js';
import { component as about } from '../pages/about.js';


routes.add("about", (kwargs, ...args) => {
  document.main.clear().append(about)    
});


routes.add("home", (kwargs, ...args) => {
  document.main.clear().append(home)

});

routes.add("login", (kwargs, ...args) => {
  console.log(`login route running with kwargs '${kwargs}' and args '${args}'.`);
});





// Set up `onhashchange` AFTER setting up routes.
window.onhashchange = onhashchange;
onhashchange();