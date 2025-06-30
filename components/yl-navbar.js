import ylComponent from "./yl-component"

export default class ylNavbar extends ylComponent {

  static get observedAttributes() {
    return ['compact', 'icon', 'minwidth', 'url'];
  }

  get html() {
    return `
      <a href="${this.url || "/"}">
        <img part="icon" src="${this.icon}"></img>
      </a>
      <div part="links">
        <slot></slot>
      </div>
    `;
  }

  get css() {
    return `
      :host {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 100;
        background-color: inherit;
      }

      :host([compact]) {
        flex-direction: column;
      }
    `;
  }

  mapDOM() {
    this.dom.icon = this.shadowRoot.querySelector('img');
    this.dom.slot = this.shadowRoot.querySelector('slot');
  }

  onClick() {
    this.expanded = this.compact ? !this.expanded : false;
  }

  onWindowResize() {
    this.compact = this.offsetWidth < this.minwidth;
    this.expanded = this.compact ? this.expanded : false;
  }

  connectedCallback() {
    this.onWindowResize();
  }
}

ylNavbar.defineElement();
