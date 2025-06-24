import ylComponent from "./yl-component"

export default class ylNavbar extends ylComponent {

  initialize() {
    return {
      collapsed: true
    };
  }

  html() {
    return `
      <p>${this.state.collapsed ? 'collapsy' : 'expandy'}</p>
    `;
  }

  css() {
    return `
      p {
        color: blue;
      }
    `;
  }
}

ylNavbar.define();