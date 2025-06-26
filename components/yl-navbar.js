import ylComponent from "./yl-component"

export default class ylNavbar extends ylComponent {

  static attributes = ['collapsed'];

  get collapsed() {
    return this.hasAttribute('collapsed');
  }

  set collapsed(value) {
    if (value) {
      this.setAttribute('collapsed', '');
    } else {
      this.removeAttribute('collapsed')
    }
  }

  html() {
    return `
      <p>${this.collapsed ? 'collapsy' : 'expandy'}</p>
      <slot></slot>
    `;
  }

  css() {
    return `
      p {
        color: blue;
      }
    `;
  }

  callbacks() {
    this.onclick = () => {
      this.collapsed = !this.collapsed;
    }
  }
}

ylNavbar.define();
