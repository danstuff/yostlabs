export default class ylComponent extends HTMLElement {

  html() {
    return ``;
  }

  css() {
    return ``;
  }
  
  get(attribute) {
    return this.hasAttribute(attribute) ? 
      this.getAttribute(attribute) || true : 
      false;
  }

  set(attribute, value) {
    if (typeof(value) == 'boolean') {
      if (value) {
        this.setAttribute(attribute, '');
      } else {
        this.removeAttribute(attribute);
      }
    } else {
      this.setAttribute(attribute, value);
    }
  }

  render() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    this.shadowRoot.innerHTML = `
      ${this.html()}
      <style>${this.css()}</style>
    `;
  }

  constructor() {
    super();

    this.render();

    // Register callback functions
    for (const key in this) {
      if (typeof(this[key]) === 'function' && key.startsWith('on')) {
        
        const callback = (e) => {
          this[key](e);
        }

        if (key.startsWith("Document", 2)) {
          document.addEventListener(key.slice(10), callback)
        } else {
          this.addEventListener(key.slice(2), callback);   
          console.log(key)
        }        
      }
    }

    for (const attribute of this.constructor.observedAttributes) {
      console.log(attribute, this[attribute]);
    }
  }

  static get observedAttributes() {
    return this.attributes();
  }

  attributeChangedCallback(_name, _oldValue, _newValue) {
    this.render();
  }

  static define() {
    // Convert CamelCase class name to kebab-case element name
    const elementName = this.name.replace(
      /([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

    if(!customElements.get(elementName)) {
      customElements.define(elementName, this);
    }
  }
}