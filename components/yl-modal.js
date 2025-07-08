import ylComponent from "./yl-component";

export default class ylModal extends ylComponent {

  static get observedAttributes() {
    return ['name', 'opened', 'maximized', 'width', 'height', 'x', 'y'];
  }

  get html() {
    return `
      <div part="actions">
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
        left: ${this.x || 0}px;
        top: ${this.y || 0}px;
        width: ${this.width || 1000}px;
        height: ${this.height || 800}px;
        max-width: 95%;
        max-height: 95%;
        z-index: 200;
        background-color: inherit;
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
      
      div[part="content"] {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      div[part="actions"] {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
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
    this.dom.template = this.querySelector('template') || {};

    this.dom.close.onclick = () => {
      this.opened = false;
    }

    this.dom.maximize.onclick = () => {
      this.maximized = !this.maximized;
    }

    this.ondragstart = (e) => {
      this.dragX = e.clientX;
      this.dragY = e.clientY;
    }

    this.ondragend = (e) => {
      const dx = this.dragX - e.clientX;
      const dy = this.dragY - e.clientY;

      this.x = (this.offsetLeft - dx);
      this.y = (this.offsetTop - dy);
    }

    this.bind(document,
      `[data-open-modal='${this.name || ""}']`, 
      'click',
      'open');
  }

  open(e) {
    this.opened = true;
    this.x = 0;
    this.y = 0;
    this.fillStubs(this.dom.template, e.target);
  }
}

ylModal.defineElement();