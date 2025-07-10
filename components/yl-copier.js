import ylComponent from "./yl-component";

export default class ylCopier extends ylComponent {
  static get STUB_PREFIX() {
    return 'yl-stub-';
  }

  copyTemplate(template, target) {
    let copyHTML = template.innerHTML;
    for (const attribute of target.attributes) {
      copyHTML = copyHTML.replaceAll(
        this.constructor.STUB_PREFIX + attribute.name,
        target.getAttribute(attribute.name));
    }
    copyHTML = copyHTML.replaceAll(
      new RegExp(`(${this.constructor.STUB_PREFIX})\\w+`, 'g'),
      "");
    
    const copy = new DOMParser().parseFromString(copyHTML,"text/html").body.firstChild;
    this.parentElement.insertBefore(copy, this);
  }

  connectedCallback() {
    const templates = this.querySelectorAll('template');
    templates.forEach((template) => {
      const copiers = `[data-copy-template='${template.dataset.name || ""}']`;
      this.watch(document, copiers, 'click', (e) => {
        this.copyTemplate(template, e.target)
      });
    })

  }
}

ylCopier.defineElement();