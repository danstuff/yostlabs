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

  renderedCallback() {
    this.dom.iframe = this.root.querySelector('iframe');
    this.dom.iframe.contentWindow.addEventListener('keydown', e => {
      if (e.key == "Escape") {
        this.dom.iframe.blur();
      }
    });
  }
}

ylAppFrame.defineElement();
