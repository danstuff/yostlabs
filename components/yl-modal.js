import ylComponent from "./yl-component";

export default class ylModal extends ylComponent {

  static get observedAttributes() {
    return ['name', 'open'];
  }

  get html() {
    return `
      <a href="#">x</a>
      <slot></slot>
    `;
  }

  get css() {
    return `
      :host {
        display: none;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 200;
        max-width: 100%;
        max-height: 100%;
      }

      :host([open]) {
        display: block;
      }
    `;
  }

  mapDOM() {
    this.dom.closeButton = this.shadowRoot.querySelector('a');
    this.dom.slot = this.shadowRoot.querySelector('slot');
  }

  onOpenModal(e) {
    this.open = true;

    const content = e.target.modalHTML;
    if (content) {
      this.dom.slot.innerHTML = content;
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