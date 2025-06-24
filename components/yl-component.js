export default class ylComponent extends HTMLElement {
  
  initialize() {
    return {};
  }

  html() {
    return ``;
  }

  css() {
    return ``;
  }
  
  get state() {
    if (!this._state) {
      this._state = {};
    }
    for (const key in this._state) {
      this._state[key] = JSON.parse(this.getAttribute(key));
    }
    return this._state;
  }

  set state(newState) {
    this._state = { ...this._state, ...newState };
    for (const key in newState) {
      this.setAttribute(key, JSON.stringify(newState[key]));
    }
    this.render();
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

  connectedCallback() {
    this.state = this.initialize();
  }

  static define() {
    /* Convert CamelCase class name to kebab-case element name */
    const elementName = this.name.replace(
      /([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

    if(!customElements.get(elementName)) {
      customElements.define(elementName, this);
    }
  }
}