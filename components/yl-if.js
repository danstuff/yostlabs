import ylComponent from "./yl-component";

export default class ylIf extends ylComponent {
  static get observedAttributes() {
    return ['truthy', 'falsy'];
  }

  get html() {
    const attrTruthy = (attribute) => {
      return this.hasAttribute(attribute) &&
             this.getAttribute(attribute) != "";
    }

    if (attrTruthy('truthy') && !attrTruthy('falsy')) {
      return `<slot></slot>`;
    } else {
      return ``;
    }
  }

  get css() {
    return `
      :host {
        display: contents;
      }
    `
  }
}

ylIf.defineElement();