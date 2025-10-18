import ylComponent from "./yl-component";

export default class ylFooter extends ylComponent {

  static get observedAttributes() {
    return [];
  }

  get html() {
    return `
      <div part="container">
        <slot></slot>
      </div>
    `;
  }

  get css() {
    return `
      :host {
        display: flex;
        flex-direction: column;

        width: 100%;
        align-items: center;

        background-color: inherit;
      }

      div[part="container"] {
        display: flex;
      }
    `;
  }
}

ylFooter.defineElement();