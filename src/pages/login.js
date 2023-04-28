import * as _form from "../components/components/form.js";
import * as _textInput from "../components/components/text-input.js";
import { composeSubs } from "../components/compositions/subs.js";

const component = createElement("div.login", {
  innerHTML: getHtml("pages/login"),
});
composeSubs(component);
component.subs.email.updateProps({
  name: "email",
  type: "email",
  label: "Email",
  required: true,
});
component.subs.password.updateProps({
  name: "password",
  type: "password",
  label: "Password",
  required: true,
});

export { component };
