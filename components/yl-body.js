import ylComponent from "./yl-component";

export default class ylBody extends ylComponent {

  static get observedAttributes() {
    return [];
  }

  get navbarHeight() {
    return document.querySelector('yl-navbar')?.offsetHeight || 0;
  }

  get footerHeight() {
    return document.querySelector('yl-footer')?.offsetHeight || 0;
  }

  get html() {
    return `
      <slot></slot>
    `;
  }

  get css() {
    return `
      :host {
        display: block;
        margin-top: ${this.navbarHeight}px;
        min-height: calc(100vh - ${this.navbarHeight + this.footerHeight}px);
      }
    `;
  }
}

ylBody.defineElement();