import ylComponent from "./yl-component";

export default class ylFilterset extends ylComponent {

  static get observedAttributes() {
    return [];
  }

  get html() {
    return `
      <slot></slot>
    `;
  }

  get css() {
    return ``;
  }
}

ylFilterset.defineElement();