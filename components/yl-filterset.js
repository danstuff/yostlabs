import ylComponent from "./yl-component";

export default class ylFilterset extends ylComponent {

  static get observedAttributes() {
    return ['name'];
  }

  filterBy(filter) {
    const filterCategory = 
      filter.dataset[`${this.name}Filter`] || "";

    for (const child of this.children) {
      const childCategory = 
        child.dataset[`${this.name}Category`] || "";

      child.style.display = 
        filterCategory == childCategory || filterCategory == "" ?
          "initial" : "none";
    }
  }

  connectedCallback() {
    const filters = 
      document.querySelectorAll(`[data-${this.name}-filter]`);

    for (const filter of filters) {
      filter.addEventListener('click', () => {
        this.filterBy(filter);
      });
    }
  }
}

ylFilterset.defineElement();