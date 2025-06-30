import ylComponent from "./yl-component";

export default class ylModal extends ylComponent {

  static get observedAttributes() {
    return ['name', 'open'];
  }

  get html() {
    return `
      <div part="container">
        <a href="#">x</a>
        <slot></slot>
      </div>
    `;
  }

  get css() {
    return `
      :host {
        display: none;
        position: fixed;
        width: 100vw;
        height: 100vh;
        z-index: 200;
      }

      :host([open]) {
        display: flex;
      }

      div {
        display: flex;
        flex-direction: column;
        margin: auto;
        max-width: 900px;
        max-height: 100%;
        overflow-y: auto;
      }
    `;
  }

  mapDOM() {
    this.dom.closeButton = this.shadowRoot.querySelector('a');
    this.dom.slot = this.shadowRoot.querySelector('slot');
  }

  onOpenModal(e) {
    this.open = true;

    const html = e.target.htmlModal;
    const css = e.target.cssModal;
    if (html || css) {
      this.dom.slot.innerHTML = `
        <style>${css}</style>
        ${html}
      `;
    }
  }

  onClick(e) {
    if (e.target == this.dom.closeButton) {
      this.open = false;
    }
  }

  connectedCallback() {
    this.bind(document,
      `[data-open-modal='${this.name || ""}']`, 
      'click',
      'onOpenModal');
  }
}

ylModal.defineElement();