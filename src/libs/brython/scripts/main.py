from browser import document, webcomponent


class BryComp:

    def __init__(self):
        """."""
        self.root = document.createElement('div')
        self.root.html = """
        <h1>Brython is Awesome!</h1>
        """
        ##self.root.update_props(dict(text="AWESOME!!!"))

    def connectedCallback(self):
        """."""
        if self.root not in self.querySelectorAll('div'):
            self.append(self.root)
        


webcomponent.define("x-bry", BryComp)

print("brython/main.py initialized.")
