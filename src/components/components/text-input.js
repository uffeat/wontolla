import { mixin } from "../utils/mixin.js";
import { composeSubs } from "../compositions/subs.js";
import { composeRoot } from "../compositions/root.js";
import { uid } from "../../utils/uid.js";
import { getColClasses } from "../../libs/bootstrap/utils/classes.js";

class TextInput extends mixin(HTMLElement) {
  #customInvalidFeedback;
  #size
  constructor() {
    super();
    // Init compositions
    composeRoot(this, {
      html: "components/text-input",
      cssClasses: ["form-floating", "mb-3"],
    });
    composeSubs(this);
    // Link labal and input
    this.subs.input.id = uid.gen("textInput");
    this.subs.label.setAttr("for", this.subs.input.id);
    // Set defaults
    this.size = 3
  }

  connectedCallback() {
    this.addRoot();
  }

  get customInvalidFeedback() {
    return this.#customInvalidFeedback;
  }

  set customInvalidFeedback(customInvalidFeedback) {
    this.#customInvalidFeedback = customInvalidFeedback;
  }

  get customValidity() {
    return this.subs.input.validity.customError;
  }

  set customValidity(customValidity) {
    if (![true, false].includes(customValidity)) {
      throw `Invalid value for 'customValidity': ${customValidity}. Must be Boolean.`;
    }
    this.subs.input.setCustomValidity(customValidity ? "" : " ");
  }

  get invalidFeedback() {
    return this.subs.invalidFeedback.text;
  }

  set invalidFeedback(invalidFeedback) {
    this.subs.invalidFeedback.text = invalidFeedback;
  }

  get label() {
    return this.subs.label.text;
  }

  set label(label) {
    this.subs.label.text = label;
    this.subs.input.placeholder = label;
  }

  get name() {
    return this.subs.input.name;
  }

  set name(name) {
    this.subs.input.name = name;
  }

  get required() {
    return this.subs.input.required;
  }

  set required(required) {
    this.subs.input.required = required;
    this.subs.requiredMessage.classList[required ? "remove" : "add"]("d-none");
  }

  get size() {
    return this.#size;
  }

  set size(size) {
    if (this.#size) {
      this.root.classList.add(...getColClasses(this.#size))
    }
    this.root.classList.add(...getColClasses(size))
    this.#size = size;
  }

  get type() {
    return this.subs.input.type;
  }

  set type(type) {
    this.subs.input.type = type;
  }

  get valid() {
    return this.subs.input.validity.valid;
  }

  set valid(_) {
    throw `'valid' is read-only.`;
  }

  get value() {
    return this.subs.input.value;
  }

  set value(value) {
    this.subs.input.value = value;
  }

  setInvalidFeedbackFromValidity() {
    if (this.subs.input.validity.valueMissing) {
      this.invalidFeedback = "Required";
    } else if (this.subs.input.validity.typeMismatch) {
      this.invalidFeedback = "Invalid format";
    } else if (this.subs.input.validity.customError) {
      this.invalidFeedback = this.customInvalidFeedback || "Invalid";
    }
  }
}

window.customElements.define("x-text-input", TextInput);
