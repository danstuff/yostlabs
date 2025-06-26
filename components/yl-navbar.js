import ylComponent from "./yl-component"

export default class ylNavbar extends ylComponent {

  static get observedAttributes() {
    return ['expanded', 'compact'];
  }

  get html() {
    return `
      <p>${this.expanded ? 'expanded!' : 'collapsed!'}</p>
      <p>${this.compact ? 'compact!' : 'full!'}</p>
      <slot></slot>
    `;
  }

  get css() {
    return `
      :host {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
      }
    `;
  }

  onClick() {
    this.expanded = this.compact ? !this.expanded : false;
  }

  onWindowResize() {
    this.compact = this.offsetWidth < 500;
    this.expanded = this.compact ? this.expanded : false;
  }
}

ylNavbar.defineElement();
