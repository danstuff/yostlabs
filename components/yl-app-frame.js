import ylComponent from "./yl-component";

export default class ylAppFrame extends ylComponent {
  static get observedAttributes() {
    return ['src'];
  }

  get html() {
    return `
      <iframe src="${this.src}"></iframe>
    `;
  }

  renderedCallback() {
    this.dom.frame = this.root.querySelector('iframe');

    this.dom.frame.onload = () => {
      this.dom.frame.style.width = 
        this.dom.frame.contentWindow.document.body.scrollWidth + "px";
      this.dom.frame.style.height = 
        this.dom.frame.contentWindow.document.body.scrollHeight + "px";
    }
  }
}

ylAppFrame.defineElement();