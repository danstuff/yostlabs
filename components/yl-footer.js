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
      }

      hr {
        margin: 0;
        padding: 0;
        border: none;
        width: 100%;
        height: 1px;
      }
    
      div {
        display: flex;
      }
    `;
  }
}

ylFooter.defineElement();