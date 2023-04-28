import { mixin } from "../utils/mixin.js";
import { composeSubs } from "../compositions/subs.js";
import { composeRoot } from "../compositions/root.js";
import * as _alert from "./alert.js";

class Form extends mixin(HTMLElement) {
  constructor() {
    super();
    // Add shadow
    this.addShadow({
      sheets: ["bootstrap/core", "bootstrap/custom", "styles/utils"],
      html: "components/form",
    });
    // Init compositions
    composeSubs(this);
    // Prepare alert component
    this.alert = createElement("x-alert", { slot: "alert" });
  }

  connectedCallback() {
    if (!this.contains(this.alert)) {
      this.append(this.alert);
    }
  }
}

window.customElements.define("x-form", Form);
