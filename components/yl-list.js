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
      :host {
        display: flex;
        justify-content: center;
      }

      :host([grid]) div[part="wrapper"] {
        display: inline-flex;
        flex-wrap: wrap;
        justify-content: center;
      }
    `;
  }

  connectedCallback() {
    const host = document.querySelector(this.categories);
    this.watch(host, '[data-category]', 'click', (e) => {
      const filterCategory = e.target.dataset.category || "";

      for (const child of this.children) {
        const childCategory = child.dataset.category || "";

        child.style.display = 
          filterCategory == childCategory || filterCategory == "" ?
            "initial" : "none";
      }
    });
  }
}

ylList.defineElement();