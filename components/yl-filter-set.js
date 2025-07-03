import ylComponent from "./yl-component";

export default class ylFilterSet extends ylComponent {

  static get observedAttributes() {
    return ['name'];
  }

  get css() {
    return `
      :host {
        display: contents;
      }
    `;
  }

  onFilter(e) {
    const filterCategory = 
      e.target.dataset[`${this.name}Filter`] || "";

    const filterableChildren = 
      this.querySelectorAll(`[data-${this.name}-category]`);
    for (const child of filterableChildren) {
      const childCategory = child.dataset[`${this.name}Category`];

      child.style.display = 
        filterCategory == childCategory || filterCategory == "" ?
          "initial" : "none";
    }
  }

  connectedCallback() {
    this.bind(document, 
      `[data-${this.name}-filter]`,
      'click',
      'onFilter');
  }
}

ylFilterSet.defineElement();