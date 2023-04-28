import { mixin } from "../utils/mixin.js";
import { composeSubs } from "../compositions/subs.js";
import { composeRoot } from "../compositions/root.js";
import * as _alert from "./alert.js";

class Form extends mixin(HTMLElement) {
  #action
  constructor() {
    super();
    composeRoot(this, { html: "components/form", cssClasses: ["container"] });
    composeSubs(this);
    // `this.subs.form` has class `row`, i.e., added elements can be styles with col-classes.

    // Expose alert component to public interface (other than via `subs`)
    this.alert = this.subs.alert;
    
    this.alert.hide();

    this.subs.submitButton.addEventListener('click', (event) => {
      if (this.action) {
        this.action(this)
      }
    })


  }

  connectedCallback() {
    this.addRoot();
  }

  get action() {
    return this.#action
  }

  set action(action) {
    this.#action = action
  }

  get controls() {
    return [...this.root.getAll("x-text-input"), ...this.root.getAll("x-checkbox")];
  }

  set controls(_) {

  }

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

  add(...controls) {
    this.subs.form.append(...controls);
  }

  clear() {
    this.subs.form.clear();
  }

  validate(customValidator, customInvalidFeedbacks) {
    this.subs.form.classList.add('needs-validation')

    

    this.subs.form.checkValidity()


    this.subs.form.classList.add('was-validated')
  }

  resetValidation() {
    this.subs.form.classList.remove('was-validated')
  }
}

window.customElements.define("x-form", Form);
