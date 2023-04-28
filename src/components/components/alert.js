import { mixin } from "../../utils/mixin.js";
import { composeSubs } from "../compositions/subs.js";
import { composeRoot } from "../compositions/root.js";
import { setStyle } from "../../libs/bootstrap/utils/classes.js";

class Alert extends mixin(HTMLElement) {
  #styleName;
  constructor() {
    super();
    composeRoot(this, { html: "alert", cssClasses: ["alert"] });
    composeSubs(this);
    // Set defaults.
    this.styleName = "info";
  }

  connectedCallback() {
    this.addRoot();
  }

  get content() {
    return this.subs.content.text;
  }

  set content(content) {
    this.subs.content.text = content;
  }

  get headline() {
    return this.subs.headline.text;
  }

  set headline(headline) {
    this.subs.headline.text = headline;
  }

  get styleName() {
    return this.#styleName;
  }

  set styleName(styleName) {
    this.#styleName = styleName;
    setStyle(this.root, "alert", styleName);
  }

  showAlert(content, kwargs = {}) {
    const [headline, styleName] = getArgs(kwargs, "headline", "styleName");
    this.content = content;
    if (headline) this.headline = headline;
    if (styleName) this.styleName = styleName;
    this.show();
  }
}

window.customElements.define("x-alert", Alert);


/* EXAMPLE

const alert1 = X.element.create("x-alert", {
  content: "Some content...",
  headline: "Cool headline",
  styleName: "primary",
  parent: document.root,
});


alert1.showAlert("New content", {
  headline: "New headline",
  styleName: "danger",
});
*/