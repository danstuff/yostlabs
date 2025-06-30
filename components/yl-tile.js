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
      <h3>${this.title}</h3>
      <yl-imageview src="${this.image}"></yl-imageview>
      <p>${this.description}</p>
      ${this.href ? 
        `<a href="${this.href}">Try It Now</a>` : 
        ``
      }
    `;
  }

  get cssModal() {
    return `
      yl-imageview {
        border-top: 1px solid white;
        border-bottom: 1px solid white;
      }

      h3 {
        margin: 0.5em;
      }

      p, a {
        margin-left: 1em;
      }
    `;
  }
}

ylTile.defineElement();