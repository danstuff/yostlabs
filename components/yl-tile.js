import ylComponent from "./yl-component";

export default class ylTile extends ylComponent {

  static get observedAttributes() {
    return ['title', 'thumbnail', 'description', 'href'];
  }

  get html() {
    return `
      <a href="#">
        <img part="image" src="${this.thumbnail}"></img>
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
}

ylTile.defineElement();