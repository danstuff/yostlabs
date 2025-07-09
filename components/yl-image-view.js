import ylComponent from "./yl-component";

export default class ylImageView extends ylComponent {

  static get observedAttributes() {
    return ['src', 'aspect', 'vignette'];
  }

  get html() {
    return `
    <svg width="100%" height="100%" focusable="true">
      <image width="100%" height="100%" preserveAspectRatio="${this.aspect || "xMidYMid slice"}" href="${this.src}" />
      ${ this.vignette ? `
        <radialGradient fx="50%" fy="50%" r="75%" spreadMethod="pad" id="grad{{index}}">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.0" />
          <stop offset="100%" stop-color="#000000" stop-opacity="1.0" />
        </radialGradient>
        <rect filter="url(#blur)" style="fill:url(#grad{{index}});" width="100%" height="100%" />
        ` : 
        ``
      }
    </svg>
    `;
  }
}

ylImageView.defineElement();