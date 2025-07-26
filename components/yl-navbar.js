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
        width: 100%;
        z-index: 100;
        background-color: inherit;
      }

      :host([compact]) {
        flex-direction: column;
      }
    `;
  }

  connectedCallback() {
    window.addEventListener('resize', e => {
      this.compact = this.offsetWidth < this.minwidth;
    });
  }
}

ylNavbar.defineElement();
