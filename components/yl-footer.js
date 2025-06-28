import ylComponent from "./yl-component";

export default class ylFooter extends ylComponent {

  static get observedAttributes() {
    return [];
  }

  get html() {
    return `
      <hr part="hr"></hr>
      <div>
        <slot></slot>
      </div>`;
  }

  get css() {
    return `
      :host {
        display: flex;
        width: 100%;
        align-items: center;
      }

      hr {
        width: inherit;
        height: 1px;
        color: white;
      }
    
      div {
        display: flex;
        flex-direction: row;
      }
    `;
  }
}

ylFooter.defineElement();