import {onhashchange, routes} from './router.js'
import { pageClasses } from '../libs/bootstrap/utils/classes.js';
import { removeHash } from '../utils/url.js';


const setPage = async (name, hash=true) => {
  const {component} = await import(`../pages/${name}.js`);
  component.classList.add(...pageClasses)
  document.main.clear().append(component)
  !hash && removeHash()  
}


routes.add("about", () => {
  setPage('about')
});

routes.add("blog-post", (kwargs, ...args) => {
  console.log(`blog-post route running with kwargs '${kwargs}' and args '${args}'.`);
});


routes.add("home", () => {
  setPage('home')

});

routes.add("login", () => {
  setPage('login')
});








// Set up `onhashchange` AFTER setting up routes.
window.onhashchange = onhashchange;
onhashchange();