import ylComponent from "./yl-component.js";
import ylWindow from "./yl-window.js";

function scaleToWindow(json) {
  const box = JSON.parse(json);
  return {
    x: box[0] * window.innerWidth,
    y: box[1] * window.innerHeight,
    w: box[2] * window.innerWidth,
    h: box[3] * window.innerHeight
  };
}

export default class ylDropzone extends ylComponent {
  static DEACIVATE_MS = 500;

  static observedAttributes = ['hotkey', 'from', 'to', 'active'];

  static _keysDown = {};

  get css() {
    return `
      :host {
        position: fixed;
        pointer-events: none;
        left: ${this.fromPx.x}px;
        top: ${this.fromPx.y}px;
        width: ${this.fromPx.w}px;
        height: ${this.fromPx.h}px;
        z-index: 100;
      }

      :host([active]) {
        pointer-events: all;
        border: 1px dashed;
        width: ${this.fromPx.w - 2}px;
        height: ${this.fromPx.h - 2}px;
      }
    `;
  }

  get fromPx() {
    return scaleToWindow(this.from);
  }

  get toPx() {
    return scaleToWindow(this.to);
  }

  get keysDown() {
    return this.constructor._keysDown;
  }

  set keysDown(value) {
    this.constructor._keysDown = value;
  }

  dropWindow() {
    ylWindow._active?.drop(this.toPx);
  }

  renderedCallback() {
    window.addEventListener("mouseout", e => {
      this.active = this.keysDown["Shift"] || false;
    });

    document.addEventListener("dragstart", e => {
      this.active = true;
    });

    this.ondragover = e => {
      e.preventDefault();
    }

    this.ondrop = e => {
      this.dropWindow();
    };

    window.addEventListener("resize", e => {
      this.renderDOM();
    })

    document.addEventListener("keydown", e => {
      if (!this.keysDown[e.key]) {
        this.keysDown[e.key] = true;
      }

      const keys = this.hotkey.split(",");
      let hotkeyCount = 0;

      for (const key of keys) {
        if (this.keysDown[key]) {
          hotkeyCount++;
        }
      }

      if (hotkeyCount == keys.length) {
        this.dropWindow();
      }

      if (e.key == "Shift"){
        this.active = true;
      }
    });

    document.addEventListener("keyup", e => {
      if (this.keysDown[e.key]) {
        this.keysDown[e.key] = false;
      }

      if (e.key == "Shift"){
        this.active = false;
      }
    });
  }
}

ylDropzone.defineElement();
