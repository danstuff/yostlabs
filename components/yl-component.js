export default class ylComponent extends HTMLElement {

  static attributes = [];

  html() {
    return ``;
  }

  css() {
    return ``;
  }

  callbacks() {
    return;
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
    this.callbacks();
    this.render();
  }

  static get observedAttributes() {
    return this.attributes;
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
