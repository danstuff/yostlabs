import ylComponent from "./yl-component";

export default class ylModal extends ylComponent {

  static get observedAttributes() {
    return ['title', 'opened', 'maximized', 'width', 'height', 'x', 'y'];
  }

  get html() {
    return `
      <div part="titlebar" draggable="true">
        <div part="title">${this.title || ""}</div>
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
        left: ${this.x}px;
        top: ${this.y}px;
        width: ${this.width}px;
        height: ${this.height}px;
        max-width: calc(100% - 16px);
        max-height: calc(100% - 16px);
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
        cursor: grab;
      }

      div[part="content"] {
        flex-grow: 1;
      }

      div.spacer {
        flex-grow: 1;
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

  renderedCallback() {
    this.dom.close = this.root.querySelector('button[part="close"]');
    this.dom.maximize = this.root.querySelector('button[part="maximize"]');
    this.dom.resize = this.root.querySelector('button[part="resize"]');
    this.dom.titlebar = this.root.querySelector('div[part="titlebar"]')

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

      this.x = Math.max(this.x, -this.width/2);
      this.y = Math.max(this.y, 0);

      this.x = Math.min(this.x, window.innerWidth-this.width/2);
      this.y = Math.min(this.y, window.innerHeight-32);
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

      this.width = Math.min(this.width, window.innerWidth);
      this.height = Math.min(this.height, window.innerHeight);

      e.preventDefault();
    }
  }

  connectedCallback() {
    this.x = this.x || 0;
    this.y = this.y || 0;
    this.width = this.width || 640;
    this.height = this.height || 480;
  }
}

ylModal.defineElement();