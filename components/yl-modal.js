import ylComponent from "./yl-component";

export default class ylModal extends ylComponent {

  static get observedAttributes() {
    return ['name', 'open'];
  }

  get html() {
    return `
      <div part="background"></div>
      <div part="container">
        <a part="closeButton" href="#">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100">
            <path
                style="stroke:white;stroke-width:0.75em;"
                d="M 5,95 95,5"/>
            <path
                style="stroke:white;stroke-width:0.75em;"
                d="M 5,5 95,95"/>
          </svg>
        </a>
        <div part="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  get css() {
    return `
      :host {
        display: none;
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }

      :host([open]) {
        display: block;
        z-index: 200;
      }
      
      div[part="container"] {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 95%;
        max-height: 95%;
        z-index: 200;
        overflow-y: auto;
      }

      div[part="content"] {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      div[part="background"] {
        position: fixed;
        z-index: 150;
        width: 100%;
        height: 100%;
      }

      a[part="closeButton"] {
        position: absolute;
        top: 0.5em;
        right: 0.5em;
        width: 1em;
        height: 1em;
      }

      a[part="closeButton"] svg {
        pointer-events: none;
      }
    `;
  }

  mapDOM() {
    this.dom.closeButton = this.shadowRoot.querySelector('a');
    this.dom.background = this.shadowRoot.querySelector('div[part="background"]');
    this.dom.template = this.querySelector('template');
  }

  onOpenModal(e) {
    this.open = true;
    this.fillStubs(this.dom.template || {}, e.target);
  }

  onClick(e) {
    if (e.target == this.dom.closeButton ||
        e.target == this.dom.background) {
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