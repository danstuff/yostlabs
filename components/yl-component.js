export default class ylComponent extends HTMLElement {
  static get observedAttributes() {
    return [];
  }

  get isComponent() {
    return true;
  }

  get html() {
    return `<slot></slot>`;
  }

  get css() {
    return ``;
  }

  static get RENDER_DELAY_MS() {
    return 10;
  }

  constructor() {
    super();

    this.reflectAttributes();
    
    this.root = this.attachShadow({ mode: 'open' });
    this.renderDOM();
  }

  attributeChangedCallback() {
    this.renderTimeout = this.renderTimeout || setTimeout(() => {
      this.renderDOM();
      this.renderTimeout = null;
    }, this.constructor.RENDER_DELAY_MS);
  }

  /**
   * Convert an attribute on an HTML element into a JavaScript value. 
   * Empty attributes return true, no attribute returns null, and 
   * numbers are converted from strings.
   * @param {*} element The HTML element.
   * @param {*} attribute The attribute to convert.
   * @returns Bool, number, string, or null.
   */
  static decodeAttribute(element, attribute) {
    const value = element.getAttribute(attribute);

    if (!value) {
      return element.hasAttribute(attribute) || null;
    }

    const num = Number(value);
    if (!Number.isNaN(num)) {
      return num;
    }

    return value;
  }

  /**
   * Set an HTML element's attribute based on the given value. True
   * values set the attribute to empty, null and false remove the
   * attribute, and anything else becomes a string value.
   * @param {*} element The HTML element.
   * @param {*} attribute The attribute to set. 
   * @param {*} value The value to set the attribute to.
   */
  static encodeAttribute(element, attribute, value) {
    if (value == this.decodeAttribute(element, attribute)) {
      return;
    }

    if (value || typeof(value) == "number") {
      element.setAttribute(attribute, 
        typeof(value) == "boolean" ? 
        "" : value);
    } else {
      element.removeAttribute(attribute);
    }
  }

  /**
   * Automatically define getters and setters for this element's 
   * observedAttributes. For example, you could get the value of
   * attribute 'foo' on a component using this.foo, or set the 
   * value of foo to 'bar' with this.foo = 'bar'.
   */
  reflectAttributes() {
    for (const attribute of this.constructor.observedAttributes) {
      Object.defineProperty(this, attribute, {
        get: () => {
          return ylComponent.decodeAttribute(this, attribute);
        },
        set: (value) => {
          return ylComponent.encodeAttribute(this, attribute, value);
        }
      })
    }
  }

  /**
   * Redraw the entire element's structure and style to the
   * element's shadowDOM. Performed automatically after creation and
   * after an attribute is changed.
   */ 
  renderDOM() {
    const newHTML = `<style>${this.css}</style>` + this.html;
    if (this.root.innerHTML != newHTML) {
      this.root.innerHTML = newHTML;
      this.dom = {};
      if (this.renderedCallback) {
        this.renderedCallback();
      }
    }
  }

  /** Print some text to the screen for debugging purposes. */
  debugLog(text) {
    let log = document.querySelector('div#yl-debug');
    if (!log) {
      log = document.createElement('div');
      log.id = 'yl-debug';
      document.body.appendChild(log);
    }

    const p = document.createElement('p');
    p.innerText = text;
    log.prepend(p);

    console.log(text);
  }

  /**
   * Use the custom elements API to associate an HTML custom 
   * element's name with this class instance. A CamelCase class 
   * name is converted to kebab-case element name, so class ylNavbar
   * links to component yl-navbar. 
   */ 
  static defineElement() {
    const elementName = this.name.replace(
      /([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

    if(!customElements.get(elementName)) {
      customElements.define(elementName, this);
    }
  }
}

ylComponent.defineElement();
