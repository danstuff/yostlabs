import ylComponent from "./yl-component.js";

function clamp(x, min, max) {
  x = Math.max(x, min);
  x = Math.min(x, max);
  return x;
}

export default class ylWindow extends ylComponent {
  get html() {
    return `
      <div part="titlebar" draggable="true">
        <div part="title">${this.title || ""}</div>
        <div class="spacer" draggable="true"></div>
        <div class="buttons">
          <button part="maximize" href="#">&#9633;</button>
          <button part="close" href="#">X</button>
        </div>
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
        left: ${this.x || 0}px;
        top: ${this.y || 0}px;
        width: ${this.width || 0}px;
        height: ${this.height || 0}px;
        max-width: 100%;
        max-height: 100%;
        z-index: ${this.z || 0};
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

      :host([template]) {
        visibility: hidden;
      }

      div[part="titlebar"] {
        display: flex;
        cursor: grab;
      }

      div[part="content"] {
        display: flex;
        flex-grow: 1;
        overflow: auto;
      }

      div[part="title"] {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      div.spacer {
        flex-grow: 1;
      }

      div.buttons {
        display: flex;
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

      button[part="close"] {
        width: 1em;
        height: 1em;
      }
    `;
  }

  static get observedAttributes() {
    return ['title', 'opened', 'maximized', 'template', 'width', 'height', 'x', 'y', 'z', 'uri'];
  }

  get CLEANUP_MS() {
    return 4000;
  }

  get OPEN_MS() {
    return 10;
  }

  get MIN_WINDOW_SIZE() {
    return 240;
  }

  get STUB_PREFIX() {
    return 'yl-stub-';
  }

  get active() {
    return this.constructor._active;
  }

  set active(window) {
    if (this.constructor._active === window) {
      return;
    }

    if (window) {
      window.z = 201;
    }

    if(this.constructor._active) {
      this.constructor._active.z = 200;
    }
    this.constructor._active = window;
  }

  get keyListener() {
    return this.constructor._keyListener;
  }

  set keyListener(listener) {
    if (this.constructor._keyListener) {
      document.removeEventListener('keydown', this.constructor._keyListener);
    }
    this.constructor._keyListener = listener;
    document.addEventListener('keydown', listener);
  }

  drag(e) {
    e.dataTransfer.setData('text', this.uri);
    e.effectAllowed = 'copyMove';

    this.dom.content.style['display'] = 'none';
  }

  drop(rect) {
    this.x = rect.x;
    this.y = rect.y;
    this.width = rect.w;
    this.height = rect.h;

    this.dom.content.style['display'] = undefined;
  }

  stamp(source) {
    let copyHTML = this.outerHTML;
    for (const attribute of source.attributes) {
      copyHTML = copyHTML.replaceAll(
        this.STUB_PREFIX + attribute.name,
        source.getAttribute(attribute.name));
    }
    copyHTML = copyHTML.replaceAll(
      new RegExp(`(${this.STUB_PREFIX})\\w+`, 'g'),
      "");

    const copy = new DOMParser()
      .parseFromString(copyHTML,"text/html").body.firstChild;

    copy.dataset.receive = "";
    copy.removeAttribute('template');
 
    this.parentElement.insertBefore(copy, this);
    copy.open();
  }

  open() {
    this.openTimeout = this.openTimeout || setTimeout(() => {
      this.opened = true;
      this.active = this;
    }, this.OPEN_MS);
  }

  close() {
    this.opened = false;
    this.destroyTimeout ||=
      setTimeout(() => {
        this.parentNode.removeChild(this);
      }, this.CLEANUP_MS);
  }

  renderedCallback() {
    this.dom.close = this.root.querySelector('button[part="close"]');
    this.dom.maximize = this.root.querySelector('button[part="maximize"]');
    this.dom.titlebar = this.root.querySelector('div[part="titlebar"]');
    this.dom.content = this.root.querySelector('div[part="content"]');

    this.onclick = () => {
      this.active = this;
    }

    this.dom.close.onclick = () => {
      this.close();
    }

    this.dom.maximize.onclick = () => {
      this.maximized = !this.maximized;
    }

    this.dom.titlebar.ondragstart = this.drag.bind(this);
  }

  connectedCallback() {
    if (this.template) {
      return;
    }

    this.width = this.width || 640;
    this.height = this.height || 480;

    const count = document.querySelectorAll('yl-window[opened]').length+1;
    const x = (count+4)*16;
    const y = (count+4)*16;

    if (window.innerWidth < x+this.width) {
      this.width = window.innerWidth-x;
      this.height = window.innerHeight-y;
      this.maximized = true;
    }

    this.x = this.x || x;
    this.y = this.y || y;
    this.z = this.z || 200;

    if (!this.active) {
      this.active = this;
    }

    this.keyListener ||= e => {
      if (!this.active) {
        return;
      }

      switch (e.key) {
        case "f":
          this.active.maximized = !this.active.maximized;
          break;
        case "Escape":
          this.active.close();
          this.active = document.querySelector('yl-window[opened]');
          break;
      }
    };
  }
}

ylWindow.defineElement();
