import ylComponent from "./yl-component";

export default class ylIcon extends ylComponent {

  static get observedAttributes() {
    return ['image', 'href'];
  }

  get html() {
    return `
      <a href="${this.href}">
        <img src="${this.image}"></img>
      </a>
    `;
  }

  get css() {
    return `
      img {
        height: 32px;
        width: 32px;
      }
    `;
  }
}

ylIcon.defineElement();