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

    const filterChildren = 
      this.querySelectorAll(`[data-${this.name}-category]`);
    for (const child of filterChildren) {
      const childCategory = child.dataset[`${this.name}Category`];

      child.style.display = 
        filterCategory == childCategory || filterCategory == "" ?
          "initial" : "none";
    }
  }

  connectedCallback() {
      const actors = `[data-${this.name}-filter]`;
      this.watch(document, actors, 'click', () => {
      const filterCategory = 
        e.target.dataset[`${this.name}Filter`] || "";

      const filterChildren = 
        this.querySelectorAll(`[data-${this.name}-category]`);
      for (const child of filterChildren) {
        const childCategory = child.dataset[`${this.name}Category`];

        child.style.display = 
          filterCategory == childCategory || filterCategory == "" ?
            "initial" : "none";
      }
    });
  }
}

ylFilterSet.defineElement();