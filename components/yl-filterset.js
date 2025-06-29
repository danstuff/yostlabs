import ylComponent from "./yl-component";

export default class ylFilterset extends ylComponent {

  static get observedAttributes() {
    return ['name'];
  }

  onFilter(e) {
    const filterCategory = 
      e.target.dataset[`${this.name}Filter`] || "";

    for (const child of this.children) {
      const childCategory = 
        child.dataset[`${this.name}Category`] || "";

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

ylFilterset.defineElement();