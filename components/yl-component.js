export default class ylComponent extends HTMLElement {

  static get STUB_PREFIX() {
    return 'yl-stub-';
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

  mapDOM() {

  }

  constructor() {
    super();

    this.reflectAttributes();
    
    this.attachShadow({ mode: 'open' });
    this.renderDOM();

    this.registerCallbacks();
  }

  attributeChangedCallback(_name, _oldValue, _newValue) {
    this.renderDOM();
  }

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
   * If the child class has specially named functions defined such as
   * 'onWindowResize' or 'onClick', register them as event listeners.
   */
  registerCallbacks() {
    if (this.onWindowResize) {
      window.addEventListener('resize', 
        this.onWindowResize.bind(this));
    }

    if (this.onClick) {
      this.shadowRoot.addEventListener('click',
        this.onClick.bind(this));
    }
  }

  /**
   * Redraw the entire element's structure and style to the
   * element's shadowDOM. Performed automatically after creation and
   * after an attribute is changed.
   */ 
  renderDOM() {
    // TODO preserve scroll position

    this.shadowRoot.innerHTML = '';
    if (this.css !== '') {
      this.shadowRoot.innerHTML += `<style>${this.css}</style>`;
    }
    this.shadowRoot.innerHTML += this.html;

    this.dom = {};
    this.mapDOM();
  }

  /**
   * Bind an event from another part of the application to an event on this component.
   * @param {*} root The root element to search with selector.
   * @param {*} selector The selector to query root for descendant elements.
   * @param {*} srcEvent The event on to bind to on the external elements.  
   * @param {*} targetEvent The function to trigger on this component when srcEvent is fired.
   */
  bind(root, selector, srcEvent, targetEvent) {
    root.querySelectorAll(selector).forEach(element => {
      element.addEventListener(srcEvent, e => {
        this[targetEvent](e);
      });
    });
  }


  fillStubs(template, source) {
    let bufferHTML = template.innerHTML;
    for (const attribute of source.attributes) {
      bufferHTML = bufferHTML.replaceAll(
        this.constructor.STUB_PREFIX + attribute.name,
        source.getAttribute(attribute.name));
    }
    bufferHTML = bufferHTML.replaceAll(
      new RegExp(`(${this.constructor.STUB_PREFIX})\\w+`, 'g'),
      "");

    this.innerHTML = bufferHTML + template.outerHTML;
    console.log(this.innerHTML);
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
