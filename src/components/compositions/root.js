/** */
function composeRoot(component, kwargs = {}) {
  // Create shallow copy of kwargs.
  kwargs = { ...kwargs };
  // Destructure.
  const { cssClasses = [], html, tag = "div" } = kwargs;

  component.root = createElement(`${tag}.root`);
  component.root.classList.add(...cssClass);

  if (html) {
    component.root.innerHTML = html;
  }

  component.addRoot = function () {
    if (!this.contains(this.root)) {
      this.append(this.root);
    }
  };
}

export { composeRoot };
