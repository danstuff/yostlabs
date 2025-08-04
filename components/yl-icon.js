import ylComponent from "./yl-component";

export default class ylIcon extends ylComponent {

  static get observedAttributes() {
    return ['image', 'href', 'title'];
  }

  get html() {
    return `
      <a href="${this.href}" part="wrapper">
        <img src="${this.image}"></img>
        ${this.title ? `<p part="title">${this.title}</p>` : ''}
      </a>
    `;
  }

  get css() {
    return `
      :host([vertical]) a {
        flex-direction: column;
      }

      a {
        display: flex;
        align-items:center;
        text-decoration: inherit;
        color: inherit;
        width: inherit;
        height: inherit;
      }

      img {
        flex-shrink: 1;
        height: inherit;
      }

      :host([vertical]) a img {
        width: inherit;
        height: unset;
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