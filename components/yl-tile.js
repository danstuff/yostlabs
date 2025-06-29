import ylComponent from "./yl-component";

export default class ylTile extends ylComponent {

  static get observedAttributes() {
    return ['title', 'image'];
  }

  get html() {
    return `
      <a href="#">
        <img part="image" src="${this.image}"></img>
        <p part="title">${this.title}</p>
      </a>
    `;
  }

  get css() {
    return `
      :host {
        display: inline-block;
        width: fit-content;
      }

      a {
        display: inline-flex;
        flex-direction: column;
        align-items:center;
        text-decoration: inherit;
        color: inherit;
      }
    `;
  }
}

ylTile.defineElement();