import ylComponent from "./yl-component"

export default class ylNavbar extends ylComponent {

  static get observedAttributes() {
    return ['compact', 'icon'];
  }

  get html() {
    return `
      <img part="icon" src="${this.icon}"></img>
      <slot part="links"></slot>
    `;
  }

  get css() {
    return `
      :host {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
      }

      slot {
        display: block;
      }
    `;
  }

  mapDOM() {
    this.dom.icon = this.shadowRoot.querySelector('img');
    this.dom.links = this.shadowRoot.querySelector('slot')
  }

  onClick() {
    this.expanded = this.compact ? !this.expanded : false;
  }

  onWindowResize() {
    this.compact = this.offsetWidth < 
      this.dom.icon.offsetWidth + this.dom.links.offsetWidth;

    this.expanded = this.compact ? this.expanded : false;
  }
}

ylNavbar.defineElement();
