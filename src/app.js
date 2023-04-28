import * as _nav from "./components/components/nav.js";
import * as _navbar from "./components/components/navbar.js";

const auxNav = createElement("x-nav", { slot: "aux" });
auxNav.links.add("signup", {href:'#signup', text: "Sign up" });
auxNav.links.add("login", {href:'#login', text: "Log in" });
auxNav.links.add("account", {href:'#account', text: "Account" });
auxNav.links.add("logout", {href:'#logout', text: "Log out" });

const mainNav = createElement("x-nav");
mainNav.links.add("blog", {href:'#blog',  text: "Blog" });
mainNav.links.add("newsletter", {href:'#newsletter-signup',  text: "Newsletter" });
mainNav.links.add("about", {href:'#about',  text: "About" });

const navBar = createElement("x-navbar", auxNav, mainNav, {
  parent: document.root.get("header"),
});
