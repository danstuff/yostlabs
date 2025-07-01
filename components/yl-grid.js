import ylComponent from "./yl-component";

export default class ylGrid extends ylComponent {

  static get observedAttributes() {
    return [];
  }

  get html() {
    return `
      <div part="wrapper">
        <slot></slot>
      </div>
    `;
  }

  get css() {
    return `
      :host {
        width: 100%;
        display: flex;
        justify-content: center;
      }

      div[part="wrapper"] {
        display: inline-flex;
        flex-wrap: wrap;
        justify-content: center;
      }
    `;
  }
}

ylGrid.defineElement();