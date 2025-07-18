import ylComponent from "./yl-component";

export default class ylAppFrame extends ylComponent {
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
    if (!this.src) {
      return;
    }
    fetch(this.src).then(response => response.text()).then(source => {  
      this.dom.wrapper.innerHTML = source;
    });
  }
}

ylAppFrame.defineElement();