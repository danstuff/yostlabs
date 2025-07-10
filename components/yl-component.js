export default class ylComponent extends HTMLElement {

  static get STUB_PREFIX() {
    return 'yl-stub-';
  }
  
  static get DRAG_MIN() {
    return 2;
  }

  static get DRAG_SCALE() {
    return 1.25;
  }

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

  constructor() {
    super();

    this.reflectAttributes();
    
    this.root = this.attachShadow({ mode: 'open' });
    this.renderDOM();
  }

  attributeChangedCallback() {
    // TODO don't immediately render, wait a few ms to see if anything else changes
    this.renderDOM();
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

    if (value) {
      element.setAttribute(attribute, 
        typeof(value) == "boolean" ? 
        "" : value);
    } else {
      element.removeAttribute(attribute);
    }
  }

  /**
   * Automatically define getters and setters for this object's 
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

  /**
   * Bind an event from another part of the application to an event on this component.
   * @param {*} root The root element to search with selector.
   * @param {*} selector The selector to query root for descendant elements.
   * @param {*} srcEvent The event on to bind to on the external elements.  
   * @param {*} callback The function to trigger when srcEvent is fired.
   */
  watch(root, selector, srcEvent, callback) {
    root.querySelectorAll(selector).forEach(element => {
      element.addEventListener(srcEvent, e => {
        callback(e);
      });
    });
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
