import ylComponent from "./yl-component";

export default class ylWindow extends ylComponent {
  static get CLEANUP_MS() {
    return 4000;
  }

  static get SETUP_MS() {
    return 10;
  }

  static get SNAP_PX() {
    return 100;
  }

  static get MIN_WINDOW_SIZE() {
    return 240;
  }

  static get topZ() {
    if (!this._topZ) {
      this._topZ = 200;
    }
    return this._topZ;
  }

  static set topZ(value) {
    this._topZ = value;
  }

  static get observedAttributes() {
    return ['title', 'opened', 'maximized', 'width', 'height', 'x', 'y', 'z'];
  }

  get html() {
    return `
      <div part="titlebar" draggable="true">
        <div part="title">${this.title || ""}</div>
        <div class="spacer"></div>
        <div>
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
        left: ${this.x}px;
        top: ${this.y}px;
        width: ${this.width}px;
        height: ${this.height}px;
        max-width: calc(100% - 16px);
        max-height: calc(100% - 16px);
        z-index: ${this.z};
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

    this.onclick = () => {
      this.z = ++this.constructor.topZ;
    }

    this.ondrag = () => {
      this.z = ++this.constructor.topZ;
    }

    this.dom.close.onclick = () => {
      this.opened = false;
      this.destroyTimeout = this.destroyTimeout || 
        setTimeout(() => {
          this.parentNode.removeChild(this);
        }, this.constructor.CLEANUP_MS);
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
      
      this.width = Math.max(this.width, this.constructor.MIN_WINDOW_SIZE);
      this.height = Math.max(this.height, this.constructor.MIN_WINDOW_SIZE);

      this.width = Math.min(this.width, window.innerWidth);
      this.height = Math.min(this.height, window.innerHeight);
    }
  }

  connectedCallback() {
    this.x = this.x || 0;
    this.y = this.y || 0;
    this.z = this.z || this.constructor.topZ;
    this.width = this.width || 640;
    this.height = this.height || 480;

    this.createTimeout = this.createTimeout || setTimeout(() => {
      this.opened = true;
    }, this.constructor.SETUP_MS);
  }
}

ylWindow.defineElement();