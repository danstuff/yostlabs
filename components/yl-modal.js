import ylComponent from "./yl-component";

export default class ylModal extends ylComponent {

  static get observedAttributes() {
    return ['name', 'opened', 'maximized', 'width', 'height', 'x', 'y'];
  }

  get html() {
    return `
      <div part="titlebar" draggable="true">
        <slot name="title"></slot>
        <div class="spacer"></div>
        <div part="actions">
          <button part="maximize" href="#">&#9633;</button>
          <button part="close" href="#">X</button>
        </div>
      </div>
      <div part="content">
        <slot></slot>
      </div>
      <button part="resize" draggable="true">&#9698;</button>
    `;
  }

  get css() {
    return `
      :host {
        visibility: hidden;
        position: fixed;
        margin: auto;
        left: ${this.x || 0}px;
        top: ${this.y || 0}px;
        width: ${this.width || 640}px;
        height: ${this.height || 480}px;
        max-width: 95%;
        max-height: 95%;
        z-index: 200;
        background-color: inherit;
        font-family: inherit;
        display: flex;
        flex-direction: column;
      }

      :host([opened]) {
        visibility: visible;
      }

      :host([maximized]) {
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
      }

      div[part="titlebar"] {
        width: 100%;
        display: flex;
      }

      div[part="content"] {
        flex-grow: 1;
      }

      div.spacer {
        flex-grow: 1;
        cursor: grab;
      }

      button {
        text-decoration: none;
        color: inherit;
        background: none;
        border: none;
        padding: 0;
        font: inherit;
        font-family: inherit;
        cursor: pointer;
      }

      button[part="resize"] {
        position: absolute;
        bottom: 1px;
        right: 2px;
        cursor: grab;
      }
    `;
  }

  mapDOM() {
    this.dom.close = this.shadowRoot.querySelector('button[part="close"]');
    this.dom.maximize = this.shadowRoot.querySelector('button[part="maximize"]');
    this.dom.resize = this.shadowRoot.querySelector('button[part="resize"]');
    this.dom.titlebar = this.shadowRoot.querySelector('div[part="titlebar"]')
    this.dom.template = this.querySelector('template') || {};

    this.dom.close.onclick = () => {
      this.opened = false;
    }

    this.dom.maximize.onclick = () => {
      this.maximized = !this.maximized;
    }

    this.dom.titlebar.ondragstart = (e) => {
      this.dragX = e.clientX;
      this.dragY = e.clientY;
    }

    this.dom.titlebar.ondragend = (e) => {
      if (this.maximized) {
        return;
      }

      const dx = this.dragX - e.clientX;
      const dy = this.dragY - e.clientY;

      this.x = (this.offsetLeft - dx);
      this.y = (this.offsetTop - dy);
    }

    this.dom.resize.ondragstart = (e) => {
      this.dragX = e.clientX;
      this.dragY = e.clientY;
    }

    this.dom.resize.ondragend = (e) => {
      if (this.maximized) {
        return;
      }

      const dx = this.dragX - e.clientX;
      const dy = this.dragY - e.clientY;

      this.width = (this.offsetWidth - dx);
      this.height = (this.offsetHeight - dy);
      
      this.width = Math.max(this.width, 240);
      this.height = Math.max(this.height, 240);

      e.preventDefault();
    }

    this.bind(document,
      `[data-open-modal='${this.name || ""}']`, 
      'click',
      'open');
  }

  open(e) {
    this.opened = true;
    this.fillStubs(this.dom.template, e.target);
  }
}

ylModal.defineElement();