import ylComponent from "./yl-component";

export default class ylTemplate extends ylComponent {
  static get observedAttributes() {
    return ['name'];
  }

  connectedCallback() {
    const copiers = `[data-template='${this.name || ""}']`;
    this.watch(document, copiers, 'click', (e) => {
      let copyHTML = this.innerHTML;
      for (const attribute of e.target.attributes) {
        copyHTML = copyHTML.replaceAll(
          this.constructor.STUB_PREFIX + attribute.name,
          e.target.getAttribute(attribute.name));
      }
      copyHTML = copyHTML.replaceAll(
        new RegExp(`(${this.constructor.STUB_PREFIX})\\w+`, 'g'),
        "");
      
      const copy = new DOMParser().parseFromString(copyHTML,"text/html").body.firstChild;
      this.parentElement.insertBefore(copy, this);
    });
  }
}

ylTemplate.defineElement();