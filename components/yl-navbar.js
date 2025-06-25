import ylComponent from "./yl-component"

export default class ylNavbar extends ylComponent {

  static attributes() {
    return ['collapsed'];
  }

  get collapsed() {
    return 'foo'
  }

  set collapsed(value) {
    return this.set('collapsed', value);
  }

  html() {
    return `
      <p>${this.collapsed ? 'collapsy' : 'expandy'}</p>
    `;
  }

  css() {
    return `
      p {
        color: blue;
      }
    `;
  }

  onClick(e) {
    this.collapsed = !this.collapsed;
  }
}

ylNavbar.define();