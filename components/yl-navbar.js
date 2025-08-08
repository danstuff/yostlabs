import ylComponent from "./yl-component"

export default class ylNavbar extends ylComponent {

  static get observedAttributes() {
    return ['compact', 'logo', 'minwidth', 'url'];
  }

  get html() {
    return `
      <a href="${this.url || "/"}">
        <img part="logo" src="${this.logo}"></img>
      </a>
      <div part="items">
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
        align-self: stretch; 
        z-index: 1000;
        background-color: inherit;
      }

      :host([compact]) {
        flex-direction: column;
      }

      div[part='items'] {
        display: flex;
        flex-direction: row;
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
