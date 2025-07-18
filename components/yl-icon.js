import ylComponent from "./yl-component";

export default class ylIcon extends ylComponent {

  static get observedAttributes() {
    return ['image', 'href', 'title'];
  }

  get html() {
    return `
      <a href="${this.href}">
        <img src="${this.image}"></img>
        ${this.title ? `<p part="title">${this.title}</p>` : ''}
      </a>
    `;
  }

  get css() {
    return `
      a, img {
        display: flex;
        flex-direction: column;
        align-items:center;
        text-decoration: inherit;
        color: inherit;
        width: inherit;
        height: inherit;
      }
      p {
        margin: 0;
        padding: 0;
      }
    `;
  }

  connectedCallback() {
    this.href ||= '#';
  }
}

ylIcon.defineElement();