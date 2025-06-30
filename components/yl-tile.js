import ylComponent from "./yl-component";

export default class ylTile extends ylComponent {

  static get observedAttributes() {
    return ['title', 'image', 'description', 'href'];
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
      a {
        display: flex;
        flex-direction: column;
        align-items:center;
        text-decoration: inherit;
        color: inherit;
      }

      img {
        aspect-ratio: 1 / 1;
        object-fit: cover;
      }
    `;
  }

  get htmlModal() {
    return `
      <yl-imageview src="${this.image}"></yl-imageview>
      <h3>${this.title}</h3>
      <p>${this.description}</p>
      ${this.href ? 
        `<a href="${this.href}">Try It Now</a>` : 
        ``
      }
    `;
  }

  get cssModal() {
    return ``;
  }
}

ylTile.defineElement();