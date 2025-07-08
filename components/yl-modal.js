import ylComponent from "./yl-component";

export default class ylModal extends ylComponent {

  static get observedAttributes() {
    return ['name', 'open', 'maximized', 'width', 'height'];
  }

  get html() {
    return `
      <div part="title-bar">
        <a part="maximize" href="#">&#9632;</a>
        <a part="close" href="#">x</a>
      </div>
      <div part="content">
        <slot></slot>
      </div>
    `;
  }

  get css() {
    return `
      :host {
        visibility: hidden;
        position: fixed;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: ${this.width || 1000}px;
        height: ${this.height || 800}px;
        max-width: 95%;
        max-height: 95%;
        z-index: 200;
        background-color: inherit;
      }

      :host([open]) {
        visibility: visible;
      }

      :host([maximized]) {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
      }
      
      div[part="content"] {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      div[part="title-bar"] {
        position: absolute;
        top: 0;
        right: 0;
      }

      a {
        text-decoration: none;
        color: inherit;
      }
    `;
  }

  mapDOM() {
    this.dom.close = this.shadowRoot.querySelector('a[part="close"]');
    this.dom.maximize = this.shadowRoot.querySelector('a[part="maximize"]');
    this.dom.template = this.querySelector('template');
  }

  onOpenModal(e) {
    this.open = true;
    this.fillStubs(this.dom.template || {}, e.target);
  }

  onClick(e) {
    if (e.target == this.dom.close) {
      this.open = false;
    } else if (e.target == this.dom.maximize) {
      this.maximized = !this.maximized;
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