import ylComponent from "./yl-component";

export default class ylWebFrame extends ylComponent {
  static get observedAttributes() {
    return ['src'];
  }

  get html() {
    return `
      <div part="wrapper"></div>
    `;
  }

  renderedCallback() {
    this.dom.wrapper = this.root.querySelector('div[part="wrapper"]');
  }

  connectedCallback() {
    fetch(this.src).then(response => response.text()).then(source => { 
      this.dom.wrapper.innerHTML = source;
    });
  }
}

ylWebFrame.defineElement();