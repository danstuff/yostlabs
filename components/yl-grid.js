import ylComponent from "./yl-component";

export default class ylGrid extends ylComponent {

  static get observedAttributes() {
    return [];
  }

  get html() {
    return `
      <slot></slot>
    `;
  }

  get css() {
    return `
      :host {
        display: inline-flex;
        flex-wrap: wrap;
        justify-content: center;
      }
    `;
  }
}

ylGrid.defineElement();