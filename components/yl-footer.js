import ylComponent from "./yl-component";

export default class ylFooter extends ylComponent {

  static get observedAttributes() {
    return [];
  }

  get html() {
    return `<slot></slot>`;
  }

  get css() {
    return `
      :host {
        display: flex;
        justify-content: center;

        position: absolute;
        bottom: 0;

        width: 100%;
        align-items: center;
      }
    `;
  }
}

ylFooter.defineElement();