import ylComponent from "./yl-component";

export default class ylModal extends ylComponent {

  static get observedAttributes() {
    return ['name', 'open'];
  }

  get html() {
    return `
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
        max-width: 95%;
        max-height: 95%;
        z-index: 200;
        background-color: inherit;
      }

      :host([open]) {
        visibility: visible;
      }
      
      div[part="content"] {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
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
      setTimeout(() => {
        this.open = false;
      }, 100);
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