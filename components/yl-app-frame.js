import ylComponent from "./yl-component.js";

export default class ylAppFrame extends ylComponent {
  static get observedAttributes() {
    return ['src'];
  }

  get html() {
    return `<iframe src="${this.src}"></iframe>`;
  }

  get css() {
    return `
      :host {
        display: flex;
        width: 100%;
        height: 100%;
      }

      iframe {
        flex-grow: 1;
        border: none;
        align-self: stretch;
      }
    `;
  }
}

ylAppFrame.defineElement();