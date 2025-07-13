import ylComponent from "./yl-component";

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

function inside(x, y, box) {
  const hw = box[2]/2;
  const hh = box[3]/2;
  return (
    x >= box[0] - hw &&
    y >= box[1] - hh &&
    x <= box[0] + hw &&
    y <= box[1] + hh
  );
}

export default class ylWindow extends ylComponent {
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
        max-width: 100%;
        max-height: 100%;
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

  static get observedAttributes() {
    return ['title', 'opened', 'maximized', 'width', 'height', 'x', 'y', 'z'];
  }

  static get CLEANUP_MS() {
    return 4000;
  }

  static get SETUP_MS() {
    return 10;
  }

  static get MIN_WINDOW_SIZE() {
    return 240;
  }

  static get active() {
    return this._active;
  }

  static set active(window) {
    window.z = 201;
    if(this._active) {
      this._active.z = 200;
    }
    this._active = window;
  }

  static get snapPoints() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dw = 250;
    const dh = 50;
    return [
      { drag: [w/2, 0, dw, dh], drop: [0,   0, w, h/2] },
      { drag: [w, h/2, dh, dw], drop: [w/2, 0, w/2, h] },
      { drag: [w/2, h, dw, dh], drop: [0, h/2, w, h/2] },
      { drag: [0, h/2, dh, dw], drop: [0,   0, w/2, h] }
    ]
  }

  drop(rect) {
    this.x = rect[0];
    this.y = rect[1];
    this.width = rect[2];
    this.height = rect[3];
  }

  renderedCallback() {
    this.dom.close = this.root.querySelector('button[part="close"]');
    this.dom.maximize = this.root.querySelector('button[part="maximize"]');
    this.dom.resize = this.root.querySelector('button[part="resize"]');
    this.dom.titlebar = this.root.querySelector('div[part="titlebar"]')

    this.onclick = () => {
      this.constructor.active = this;
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

    this.dom.titlebar.ondragstart = e => {
      this.dragX = e.clientX;
      this.dragY = e.clientY;
    }

    this.dom.titlebar.ondragend = e => {
      this.constructor.active = this;

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

      for (const point of this.constructor.snapPoints) {
        if (inside(e.clientX, e.clientY, point.drag)) {
          this.drop(point.drop);
          break;
        }
      }
    }

    this.dom.resize.ondragstart = e => {
      this.dragX = e.clientX;
      this.dragY = e.clientY;
    }

    this.dom.resize.ondragend = e => {
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
    this.z = this.z || 200;
    this.width = this.width || 640;
    this.height = this.height || 480;

    if (!this.constructor.active) {
      document.addEventListener('keydown', e => {
        if (e.shiftKey) {
          let dropRect = null;
          switch(e.key) {
            case "ArrowUp": dropRect = this.constructor.snapPoints[0].drop; break;
            case "ArrowRight": dropRect = this.constructor.snapPoints[1].drop; break;
            case "ArrowDown": dropRect = this.constructor.snapPoints[2].drop; break;
            case "ArrowLeft": dropRect = this.constructor.snapPoints[3].drop; break;
          }
          if (dropRect) {
            this.constructor.active.drop(dropRect);
          }
        }
  
        switch (e.key) {
          case "f":
            this.constructor.active.maximized = !this.constructor.active.maximized;
            break;
        }
      });
    }

    this.createTimeout = this.createTimeout || setTimeout(() => {
      this.opened = true;
      this.constructor.active = this;
    }, this.constructor.SETUP_MS);
  }
}

ylWindow.defineElement();