import { mixin } from "../utils/mixin.js";
import { composeSubs } from "../compositions/subs.js";
import { composeRoot } from "../compositions/root.js";
import * as _alert from "./alert.js";

class Form extends mixin(HTMLElement) {
  #action;
  constructor() {
    super();
    composeRoot(this, { html: "components/form", cssClasses: ["container"] });
    composeSubs(this);
    // `this.subs.form` has class `row`, i.e., added elements can be styles with col-classes.

    // Expose alert component to public interface (other than via `subs`)
    this.alert = this.subs.alert;

    this.alert.hide();

    this.subs.submitButton.addEventListener("click", (event) => {
      if (this.action) {
        this.action(this);
      }
    });
  }

  connectedCallback() {
    this.addRoot();
  }

  get action() {
    return this.#action;
  }

  set action(action) {
    this.#action = action;
  }

  get controls() {
    return [
      ...this.root.getAll("x-text-input"),
      ...this.root.getAll("x-checkbox"),
    ];
  }

  set controls(_) {}

  get data() {
    const data = {};
    this.controls.forEach((control) => {
      data[control.name] = control.value;
    });
    return data;
  }

  set data(data) {
    this.controls.forEach((control) => {
      if (control.name in data) {
        control.value = data[control.name];
      }
    });
  }

  get showValid() {
    return !this.subs.form.classList.contains("no-show-valid")
  }

  set showValid(showValid) {
    this.subs.form.classList[showValid ? 'remove': 'add']("no-show-valid")
  }

  get valid() {
    return this.subs.form.checkValidity();
  }

  set valid(_) {
    throw `'valid' is read-only.`

  }

  add(...controls) {
    this.subs.form.append(...controls);
  }

  clear() {
    this.subs.form.clear();
  }

  validate(customValidator) {
    this.subs.form.classList.add("needs-validation");

    if (customValidator) {
      customValidator()
    }

    this.subs.form.checkValidity();

    this.controls.forEach((control) => {
      

      if (!control.valid) {
        control.setInvalidFeedbackFromValidity();
        control.liveValidation = true
        console.log(`Name of invalid control: ${control.name}`)
      } else {
        control.liveValidation = false
      }
    });

    this.subs.form.classList.add("was-validated");

    return this.valid
  }

  resetValidation() {
    this.subs.form.classList.remove("was-validated");
  }
}

window.customElements.define("x-form", Form);
