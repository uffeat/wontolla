import { assets } from "../assets/_assets.js";

// ALIASES

Element.prototype.get = Element.prototype.querySelector;
Element.prototype.getAll = Element.prototype.querySelectorAll;

ShadowRoot.prototype.get = ShadowRoot.prototype.querySelector;
ShadowRoot.prototype.getAll = ShadowRoot.prototype.querySelectorAll;

document.get = document.querySelector;
document.getAll = document.querySelectorAll;

document.root = document.getElementById("root");

// Html

/** */
function getHtml(arg) {
  if (arg.trim().startsWith("<")) {
    // `arg` is already HTML
    return arg;
  }
  if (!arg.endsWith(".html")) {
    arg = `${arg}.html`;
  }
  if (!(arg in assets)) {
    throw new TypeError(`Invalid assets path: ${arg}.`);
  }
  return assets[arg];
}

window.getHtml = getHtml;

// Function tools

const checkKwargs = (kwargs, ...validKeys) => {
  if (kwargs) {
    if (validKeys.length > 0) {
      // Check keys.
      const invalidKeys = Object.keys(kwargs).filter(
        (key) => !validKeys.includes(key)
      );
      if (invalidKeys.length > 0) {
        throw Error(`Invalid arg: ${invalidKeys}.`);
      }
    }
    // Return shallow copy of kwargs.
    return { ...kwargs };
  }
};

window.checkKwargs = checkKwargs;

const getArgs = (kwargs, ...keys) => {
  if (!kwargs) return;
  if (keys.length === 0) return;
  // Operate on shallow copy of kwargs.
  kwargs = { ...kwargs };

  // Check keys.
  const invalidKeys = Object.keys(kwargs).filter((key) => !keys.includes(key));
  if (invalidKeys.length > 0) {
    throw Error(`Invalid arg: ${invalidKeys}.`);
  }
  return keys.map((key) => kwargs[key]);
};

window.getArgs = getArgs;

// Promise tools

const createPromise = (executor) => {
  return new Promise(executor);
};

window.createPromise = createPromise;

const createAndAwaitPromise = async (executor) => {
  return await createPromise(executor);
};

window.createAndAwaitPromise = createAndAwaitPromise;


const createElement = (...args) => {
  // Creates HTML element with options to set CSS classes, add children,
  // add to parent, set inner HTML and attach shadow.

  const [arg, ...children] = args;
  const [tag, ...classes] = arg.split(".");

  const element = document.createElement(tag);

  /*
  This line uses destructuring assignment and the spread operator to extract certain 
  properties from the last item in the children array, which is assumed to be an object 
  containing optional properties for the new element.
  children.pop(): This removes and returns the last item in the children array. 
  If the children array is empty, this returns undefined.
  || {}: If children.pop() returns undefined, this provides a fallback value of an empty object ({}).
  { html, parent, shadow, ...props }: This uses destructuring assignment to extract the html, 
  parent, and shadow properties from the last item in the children array, if they exist. 
  The ...props syntax assigns any remaining properties from the last item to the props variable, 
  which will be an object containing all remaining properties.
  Putting it all together, this line of code essentially creates variables html, parent, 
  and shadow containing the values of those properties from the last item in the children array, 
  if they exist. It also creates an object props containing all remaining properties from the last item. 
  If the children array is empty, all variables and props are assigned the value of an empty object ({}).
  This technique is often used to extract certain properties from an object while ignoring others, 
  and is commonly used with function arguments to provide default values for missing parameters.
  */
  const { html, parent, shadow, ...props } = children.pop() || {};

  if (shadow) {
    // If `shadow` is a list or a tuple, it contains stylesheet `assets` keys (strings).
    const sheets = Array.isArray(shadow) ? shadow : null;

    element.addShadow({ html, sheets });
  } else {
    if (html) {
      element.innerHTML = getHtml(html);
    }
  }

  if (classes.length) {
    element.classList.add(...classes);
  }

  if (children.length) {
    element.append(...children);
  }

  if (parent) {
    element.parent = parent;
  }

  if (Object.keys(props).length) {
    //
    Object.assign(element, props);
  }

  return element;
}

window.createElement = createElement

const createElementFromHtml = (html, kwargs = {}) => {
  // Creates HTML element from 'outer' HTML with options,
  // add to parent and attach shadow root.

  const [parent, shadow = false] = X.getArgs(kwargs, "parent", "shadow");

  html = getHtml(html);
  let element;

  if (shadow) {
    element = document.createElement("div");
    // If `shadow` is a list or a tuple, it contains stylesheet `assets` keys (strings).
    const sheets = Array.isArray(shadow) ? shadow : null;
    element.addShadow({ html, sheets });
  } else {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    if (temp.children.length > 1) {
      // No single top-level element; add such.
      element = temp;
    } else {
      element = temp.firstElementChild;
    }
  }

  if (parent) {
    element.parent = parent;
  }

  return element;
}

window.createElementFromHtml = createElementFromHtml

// STRUCTURE.

Object.defineProperty(HTMLElement.prototype, "parent", {
  get: function () {
    return this.parentElement;
  },
  set: function (parent) {
    parent.append(this);
  },
  configurable: true,
});

Object.defineProperty(HTMLElement.prototype, "html", {
  get: function () {
    return this.innerHTML;
  },
  set: function (html) {
    this.innerHTML = html;
  },
  configurable: true,
});

HTMLElement.prototype.clear = function (slot) {
  if (slot === undefined) {
    while (this.firstChild) {
      this.firstChild.remove();
    }
  } else {
    [...this.children].forEach((child) => {
      if ((slot === "" && !child.slot) || child.slot === slot) {
        child.remove();
      }
    });
  }
  return this; // Allows chaining.
};

// SHADOW

/**
 * Attaches a shadow root to an HTML element.
 * @param {object} kwargs - An object containing optional arguments.
 * @param {boolean} [kwargs.delegatesFocus=false] - Whether the shadow root delegates focus.
 * @param {string} [kwargs.html=null] - The HTML string to add to the shadow root.
 * @param {Array} [kwargs.sheets=null] - An array of asset keys to add as stylesheets to the shadow root.
 * @returns {ShadowRoot} The newly created shadow root.
 */
function addShadow(kwargs = {}) {
  // Create shallow copy kwargs object. Ensures that original object passed as a parameter remains unchanged;
  // useful in preventing unintended side effects.
  kwargs = { ...kwargs };
  // Destructure.
  const { delegatesFocus = false, html, sheets } = kwargs;

  this.attachShadow({
    mode: "open",
    delegatesFocus: delegatesFocus,
  });

  if (html) {
    this.shadowRoot.innerHTML = getHtml(html);
  }

  if (sheets) {
    // `sheets` is an array of assets keys ("paths").
    // Add stylesheets from `_assets` to shadow root:
    this.shadowRoot.addSheets(...sheets);
  }
  // Add alias for consistency with non-shadow components.
  this.root = this.shadowRoot;

  // Return shadow root to respect native pattern.
  return this.shadowRoot;
}

// Add `addShadow` as a method of `HTMLElement.prototype`.
HTMLElement.prototype.addShadow = addShadow;

// PROPS.





/** Updates element and element.style properties. */
HTMLElement.prototype.updateProps = function (props) {
  if (props && Object.keys(props).length >= 0) {
    for (const [prop, value] of Object.entries(props)) {
      // Allow new private prop.
      if (prop.startsWith("_")) {
        this[prop] = value;
      } else if (prop in this) {
        this[prop] = value;
      } else if (prop in this.style) {
        this.style[prop] = value;
      } else {
        throw new Error(`Invalid property: '${prop}'.`);
      }
    }
  }
  return this; // Allows chaining and in-line application.
};

Object.defineProperty(Node.prototype, "text", {
  get: function () {
    return this.textContent;
  },
  set: function (text) {
    this.textContent = text;
  },
  configurable: true,
});

// ATTRS

function setAttr(name, value) {
  if (value) {
    this.setAttribute(name, value)
  } else {
    this.removeAttribute(name)
  }
}

HTMLElement.prototype.setAttr = setAttr;
ShadowRoot.prototype.setAttr = setAttr;

// STYLE

/**
 * Adds "stylesheets" to document or a shadow root.
 * @param {...string} paths - The paths of the stylesheets to add.
 * @throws {KeyError} If an invalid assets path is provided.
 */
function addSheets(...paths) {
  for (let path of paths) {
    if (!path.endsWith(".css")) {
      path = `${path}.css`;
    }
    // `_assets` is an object with `path` keys and CSS text as values.
    if (!(path in assets)) {
      throw new Error(`Invalid assets path: \`${path}\`.`);
    }
    const cssText = assets[path];
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(cssText);
    //sheet.replace(cssText);
    this.adoptedStyleSheets = [...this.adoptedStyleSheets, sheet];
  }
}

// Add `addSheets` as a method of `ShadowRoot.prototype`.
ShadowRoot.prototype.addSheets = addSheets;
// NOTE: Could be expanded to also work for document (would probably need to bind).

/** Useful for adding small component-specific css snippets to document.
 * Should be invoked from component module. */
document.addCss = (cssText) => {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(cssText);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
};

const classesProp = {
  get: function () {
    if (this._classes) return this._classes;
    const elementThis = this;

    class Classes {
      add(...args) {
        args.forEach((arg) => elementThis.classList.add(arg));
      }
      remove(...args) {
        args.forEach((arg) => elementThis.classList.remove(arg));
      }
      clear() {
        elementThis.classList = "";
      }
      has(arg) {
        elementThis.classList.contains(arg);
      }
      toggle(arg) {
        elementThis.classList.toggle(arg);
      }
    }
    this._classes = new Classes();
    return this._classes;
  },
  set: function (_) {
    throw `classes is read-only.`;
  },
  configurable: true,
};

Object.defineProperty(HTMLElement.prototype, "classes", classesProp);
Object.defineProperty(ShadowRoot.prototype, "classes", classesProp);

// EVENTS

function sendEvent(name, detail) {
  let event;
  if (detail) {
    event = new CustomEvent(name, { detail });
  } else {
    event = new Event(name);
  }
  this.dispatchEvent(event);
  return event;
}

HTMLElement.prototype.sendEvent = sendEvent;
ShadowRoot.prototype.sendEvent = sendEvent;

// COMPOSITION WITH CLASSES

HTMLElement.prototype.compose = function (Composition, ...args) {
  this[Composition.name.toLowerCase()] = new Composition(this, ...args);
};

// SHOW/HIDE

function show() {
  this.classList.remove("d-none");
}

HTMLElement.prototype.show = show;
ShadowRoot.prototype.show = show;

function hide() {
  this.classList.add("d-none");
}

HTMLElement.prototype.hide = hide;
ShadowRoot.prototype.hide = hide;
