import * as _form from "../components/components/form.js";
import * as _textInput from "../components/components/text-input.js";
import { composeSubs } from "../components/compositions/subs.js";


const component = createElement("div.login", {
  innerHTML: getHtml("pages/login"),
});
composeSubs(component);

const emailComponent = createElement('x-text-input.col-md-6', {
  name: "email",
  type: "email",
  label: "Email",
  required: true,
});

const passwordComponent = createElement('x-text-input.col-md-6', {
  name: "password",
  type: "password",
  label: "Password",
  required: true,
});

component.subs.form.add(emailComponent, passwordComponent)
component.subs.form.showValid = false

component.subs.form.action = (form) => {
  console.log(`action running`)

  if (!form.validate()) {
    console.log(`Form is invalid.`)
    return
  }


}


export { component };
