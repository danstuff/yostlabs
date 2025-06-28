import ylComponent from "./yl-component";

export default class ylTile extends ylComponent {

  static get observedAttributes() {
    return [];
  }

  get html() {
    return `
      <p>${this.title}</p>
    `;
  }

  get css() {
    return ``;
  }
}

ylTile.defineElement();