import * as _form from "../components/components/form.js";
import * as _textInput from "../components/components/text-input.js";
import { composeSubs } from "../components/compositions/subs.js";


const component = createElement("div.signup", {
  innerHTML: getHtml("pages/signup"),
});
composeSubs(component);



const passwordComponent = createElement('x-text-input.col-md-6', {
  name: "password",
  type: "password",
  label: "Password",
  required: true,
});

const passwordComponent2 = createElement('x-text-input.col-md-6', {
  name: "password2",
  type: "password",
  label: "Password (repeat)",
  required: true,
});

component.subs.form.add(passwordComponent, passwordComponent2)
component.subs.form.showValid = false

component.subs.form.action = (form) => {
  //console.log(`action running`)

  if (!form.validate()) {
    console.log(`Form is invalid.`)
    return
  }


}


export { component };
