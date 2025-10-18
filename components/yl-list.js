import ylComponent from "./yl-component";

export default class ylList extends ylComponent {

  static get observedAttributes() {
    return ['categories'];
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
      :host([grid]) div[part="wrapper"] {
        display: inline-flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: start;
      }

      div[part="wrapper"] {
        display: flex;
        flex-direction: column;
        align-items: stretch;
      }
    `;
  }

  filter(e) {
    const filterCategory = e.dataset.category || "";

    for (const child of this.children) {
      const childCategory = child.dataset.category || "";

      child.style.display = 
        filterCategory == childCategory || filterCategory == "" ?
          "initial" : "none";
    }
  }
}

ylList.defineElement();