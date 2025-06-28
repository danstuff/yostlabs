import ylComponent from "./yl-component";

export default class ylFooter extends ylComponent {

  static get observedAttributes() {
    return [];
  }

  get html() {
    return `
      <hr part=""></hr>
      <div>
        <slot></slot>
      </div>`;
  }

  get css() {
    return `
      hr {
        width: 100%;
        height: 1px;
        color: white;
      }
      div {
        width: 100%;
      }

      yl-icon {
        height: 32px;
      }
    `;
  }
}

ylFooter.defineElement();