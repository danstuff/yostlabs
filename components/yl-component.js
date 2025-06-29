export default class ylComponent extends HTMLElement {

  static get observedAttributes() {
    return [];
  }

  get html() {
    return ``;
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
          const value = this.getAttribute(attribute);

          if (!value) {
            return this.hasAttribute(attribute) || null;
          }

          const num = Number(value);
          if (!Number.isNaN(num)) {
            return num;
          }

          return value;
        },
        set: (value) => {
          if (value) {
            this.setAttribute(attribute, 
              typeof(value) == "boolean" ? 
                "" : value);
          } else {
            this.removeAttribute(attribute);
          }
        }
      })
    }
  }

  /**
   * If the child class has functions defined such as
   * 'onWindowResize' or 'onClick', register them as event
   * listeners.
   */
  registerCallbacks() {
    if (this.onWindowResize) {
      window.addEventListener('resize', 
        this.onWindowResize.bind(this));
    }

    if (this.onClick) {
      this.addEventListener('click',
        this.onClick.bind(this));
    }

    if (this.onImagesLoaded) {
      this.imagesLeft = (this.shadowRoot.images?.length || 0) + 1;
      for (const image in this.shadowRoot.images) {
        image.addEventListener('load',
          this.checkImagesLoaded.bind(this));
      }
      this.checkImagesLoaded();
    }
  }

  /**
   * Redraw the entire element's structure and style to the
   * element's shadowDOM. Performed automatically after creation and
   * after an attribute is changed.
   */ 
  renderDOM() {
    this.shadowRoot.innerHTML = `
      <style>${this.css}</style>
      ${this.html}
    `;

    this.dom = {};
    this.mapDOM();
  }

  checkImagesLoaded() {
    this.imagesLeft--;
    if (this.imagesLeft == 0) {
      this.onImagesLoaded();
    }
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
