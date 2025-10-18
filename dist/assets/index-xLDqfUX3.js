(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();class b{static elementAdded(t){if(t.childNodes.forEach(r=>{this.elementAdded(r)}),!t.dataset)return;const e=t.dataset.broadcast;if(!e)return;let[i,s]=e.split("->");s||=i,t.addEventListener(i,()=>{document.querySelectorAll("[data-receive]").forEach(r=>{r.dataset.receive.split(" ").forEach(o=>{let[c,a]=o.split("->");c==s&&(a||=c,r[a](t))})})})}static connect(){new MutationObserver(e=>{e.forEach(i=>{i.addedNodes.forEach(s=>{this.elementAdded(s)})})}).observe(document.body,{subtree:!0,childList:!0}),document.querySelectorAll("[data-broadcast]").forEach(e=>{this.elementAdded(e)})}}b.connect();class h extends HTMLElement{static get observedAttributes(){return[]}get isComponent(){return!0}get html(){return"<slot></slot>"}get css(){return""}static get RENDER_DELAY_MS(){return 10}constructor(){super(),this.reflectAttributes(),this.root=this.attachShadow({mode:"open"}),this.renderDOM()}attributeChangedCallback(){this.renderDOM()}static decodeAttribute(t,e){const i=t.getAttribute(e);if(!i)return t.hasAttribute(e)||null;const s=Number(i);return Number.isNaN(s)?i:s}static encodeAttribute(t,e,i){i!=this.decodeAttribute(t,e)&&(i||typeof i=="number"?t.setAttribute(e,typeof i=="boolean"?"":i):t.removeAttribute(e))}reflectAttributes(){for(const t of this.constructor.observedAttributes)Object.defineProperty(this,t,{get:()=>h.decodeAttribute(this,t),set:e=>h.encodeAttribute(this,t,e)})}renderDOM(){const t=`<style>${this.css}</style>`+this.html;this.root.innerHTML!=t&&(this.root.innerHTML=t,this.dom={},this.renderedCallback&&this.renderedCallback())}debugLog(t){let e=document.querySelector("div#yl-debug");e||(e=document.createElement("div"),e.id="yl-debug",document.body.appendChild(e));const i=document.createElement("p");i.innerText=t,e.prepend(i),console.log(t)}static defineElement(){const t=this.name.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();customElements.get(t)||customElements.define(t,this)}}h.defineElement();class x extends h{static get observedAttributes(){return["src"]}get html(){return`<iframe src="${this.src}"></iframe>`}get css(){return`
      :host {
        display: flex;
        width: 100%;
        height: 100%;
      }

      iframe {
        flex-grow: 1;
        border: none;
        align-self: stretch;
      }
    `}}x.defineElement();class y extends h{static get observedAttributes(){return[]}get html(){return`
      <div part="container">
        <slot></slot>
      </div>
    `}get css(){return`
      :host {
        display: flex;
        flex-direction: column;

        width: 100%;
        align-items: center;

        background-color: inherit;
      }

      div[part="container"] {
        display: flex;
      }
    `}}y.defineElement();class v extends h{static get observedAttributes(){return["image","href","title"]}get html(){return`
      <a href="${this.href}" part="wrapper">
        <img src="${this.image}"></img>
        ${this.title?`<p part="title">${this.title}</p>`:""}
      </a>
    `}get css(){return`
      :host([vertical]) a {
        flex-direction: column;
      }

      a {
        display: flex;
        align-items:center;
        text-decoration: inherit;
        color: inherit;
        width: inherit;
        height: inherit;
      }

      img {
        flex-shrink: 1;
        height: inherit;
      }

      :host([vertical]) a img {
        width: inherit;
        height: unset;
      }

      p {
        margin: 0;
        padding: 0;
      }
    `}connectedCallback(){this.href||="#"}}v.defineElement();class w extends h{static get observedAttributes(){return["truthy","falsy"]}get html(){const t=e=>this.hasAttribute(e)&&this.getAttribute(e)!="";return t("truthy")&&!t("falsy")?"<slot></slot>":""}get css(){return`
      :host {
        display: contents;
      }
    `}}w.defineElement();class _ extends h{static get observedAttributes(){return["src","zoom","x","y"]}get css(){return`
      :host {
        display: block;
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;
        user-select: none;
        touch-action: none;
        cursor: move;
      }
      img {
        position: absolute;
        transform-origin: 0 0;
        transform: translate(${this.x}px, ${this.y}px) scale(${this.zoom});
        pointer-events: none;
        width: 100%;
      }
    `}get html(){return`
      <img src="${this.src||""}"></img>
    `}connectedCallback(){this.dom.img=this.root.querySelector("img"),this.zoom=1,this.x=0,this.y=0,this._dragStart=null,this._lastTransform={x:0,y:0},this.addEventListener("wheel",this._handleWheel.bind(this)),this.addEventListener("touchstart",this._handleDragStart.bind(this)),this.addEventListener("touchmove",this._handleDragMove.bind(this)),this.addEventListener("touchend",this._handleDragEnd.bind(this)),this.addEventListener("mousedown",this._handleDragStart.bind(this)),document.addEventListener("mousemove",this._handleDragMove.bind(this)),document.addEventListener("mouseup",this._handleDragEnd.bind(this))}_handleWheel(t){t.preventDefault();const e=t.deltaY>0?.9:1.1,i=this.getBoundingClientRect(),s=t.clientX-i.left,r=t.clientY-i.top;this._handleZoom(s,r,e)}_handleZoom(t,e,i){const s=Math.max(.1,Math.min(10,this.zoom*i));this.x=t-(t-this.x)*(s/this.zoom),this.y=e-(e-this.y)*(s/this.zoom),this.zoom=s}_handleDragStart(t){if(t.touches)if(t.touches.length===2){const e=t.touches[0],i=t.touches[1];this._initialPinchDistance=Math.hypot(i.clientX-e.clientX,i.clientY-e.clientY),this._initialZoom=this.zoom;const s=this.getBoundingClientRect();this._pinchMidpoint={x:(e.clientX+i.clientX)/2-s.left,y:(e.clientY+i.clientY)/2-s.top}}else{const e=t.touches[0];this._dragStart={x:e.clientX-this.x,y:e.clientY-this.y}}else this._dragStart={x:t.clientX-this.x,y:t.clientY-this.y}}_handleDragMove(t){if(t.touches){if(t.touches.length===2){const e=t.touches[0],i=t.touches[1],s=Math.hypot(i.clientX-e.clientX,i.clientY-e.clientY),r=s/this._initialPinchDistance;this._handleZoom(this._pinchMidpoint.x,this._pinchMidpoint.y,r),this._initialPinchDistance=s}else if(this._dragStart){const e=t.touches[0];this.x=e.clientX-this._dragStart.x,this.y=e.clientY-this._dragStart.y}}else this._dragStart&&(this.x=t.clientX-this._dragStart.x,this.y=t.clientY-this._dragStart.y)}_handleDragEnd(){this._dragStart=null,this._initialPinchDistance=null,this._initialZoom=null,this._pinchMidpoint=null}}_.defineElement();class E extends h{static get observedAttributes(){return["categories"]}get html(){return`
      <div part="wrapper">
        <slot></slot>
      </div>
    `}get css(){return`
      :host([grid]) div[part="wrapper"] {
        display: inline-flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: start;
      }

      div[part="wrapper"] {
        display: flex;
        flex-direction: column;
        align-items: stretch;
      }
    `}filter(t){const e=t.dataset.category||"";for(const i of this.children){const s=i.dataset.category||"";i.style.display=e==s||e==""?"initial":"none"}}}E.defineElement();class L extends h{static get observedAttributes(){return["compact","logo","minwidth","url"]}get html(){return`
      <a href="${this.url||"/"}">
        <img part="logo" src="${this.logo}"></img>
      </a>
      <div part="items">
        <slot></slot>
      </div>
    `}get css(){return`
      :host {
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-self: stretch; 
        z-index: 100;
        background-color: inherit;
      }

      :host([compact]) {
        flex-direction: column;
      }

      div[part='items'] {
        display: flex;
        flex-direction: row;
      }
    `}connectedCallback(){window.addEventListener("resize",t=>{this.compact=this.offsetWidth<this.minwidth})}}L.defineElement();function $(n){for(let t=n.length-1;t>0;t--){const e=Math.floor(Math.random()*(t+1));[n[t],n[e]]=[n[e],n[t]]}}class f{get length(){const t=this.parent.children,e=Object.keys(t),i=e.indexOf(this.name)+1;return i>=t.length?this.source.length-this.index:t[e[i]].index-this.index}get content(){return this.source.substr(this.index,this.length)}constructor(t,e,i,s){this.name=t,this.path=e?.path?[...e.path,t]:[t],this.source=e?.source||i,this.file=e?.file||s,this.index=this.source.indexOf(t,e?.index||0),this.parent=e,this.children={},this.setups=[]}walk(t,e){e&&e(this);let i=this;for(let s=1;s<t.length&&(i=i.children[t[s]],!!i);s++)e&&e(i)}push(t){const e=new f(t,this);return this.children[t]=e,e}pop(){return this.parent}getLineNumber(t){return this.source.substr(0,t).match(/\r?\n/g).length+1}getLine(t){return t=t||this.index,this.source.substr(t,this.source.indexOf(`
`,t)-t)}getExpectLine(t){let e=this.index;for(;t>0;)e=this.source.indexOf("this.expect",e+1),t--;return{file:this.file,number:this.getLineNumber(e),text:this.getLine(e)}}}class A{get passed(){return this.failCount==0}get status(){const t=this.sourceNode.path.join(" ").trim();return this.failCount<=0?`${t}: PASS`:`${t}: FAIL (${this.failCount})
${this.failLog}
`}constructor(t,e){this.sourceNode=t,this.run=e,this.expectCount=0,this.failCount=0,this.failLog=""}assert(t,e){if(!t){this.failCount++;const i=this.sourceNode.getExpectLine(this.expectCount);this.failLog+=`
 ${i.file}:${i.number}
  ${i.text}

  ${e}
`}}}class S extends h{static get observedAttributes(){return["status","src","failcount"]}get html(){return`
      <div class="frame">
        <slot></slot>
      </div>
      <div class="${this.failcount?"fail":"pass"}">
        <div class="status-box"></div>
        <p>${this.src}<br>${this.status} Failed examples: ${this.failcount||0}</p>
      </div>
    `}get css(){return`
      div {
        margin: 5px;
        vertical-align: middle;
      }

      p {
        vertical-align: middle;
        display: inline-block;
        margin: 0;
      }
      
      div.frame {
        border: 1px dashed black;
        width: max-content;
      }

      div.status-box {
        width: 1em;
        height: 1em;
        border: 1px solid black;
        border-radius: 1em;
        display: inline-block;
      }

      div.fail div.status-box {
        background-color: #FF0000;
      }

      div.pass div.status-box {
        background-color: #00FF00;
      }
    `}connectedCallback(){this.status="Downloading...",this.failcount=0,this.tests=[],fetch(this.src).then(t=>t.text()).then(t=>{this.status="Loading Tests...",this.source=t,this.rootSourceNode=new f("",null,t,this.src),this.sourceNode=this.rootSourceNode,Function(t).bind(this)(),$(this.tests),this.status="Running...";for(const e of this.tests)this.test=e,this.data={},this.runSetups(e),e.run(),console.log(e.status),e.passed||(this.failcount=this.failcount+1);this.status="Done."})}runSetups(t){this.rootSourceNode.walk(t.sourceNode.path,e=>{for(const i of e.setups)i()})}click(t){t.click()}type(t){return{in:e=>{for(const i of t)e.dispatchEvent(new KeyboardEvent("keypress",{key:i}))}}}describe(t,e){this.sourceNode=this.sourceNode.push(t),e(),this.sourceNode=this.sourceNode.pop()}let(t){this.sourceNode.setups.push(t)}it(t,e){this.sourceNode=this.sourceNode.push(t),this.tests.push(new A(this.sourceNode,e)),this.sourceNode=this.sourceNode.pop()}expect(t){this.test.expectCount++;let e=t?.constructor?.name||"object";const i=o=>{this.test.assert(t!=null==o,`Expected ${e} to ${o?"":"not "}exist but got ${t}`)},s=(o,c)=>{this.test.assert(t==o==c,`Expected ${e} to ${c?"":"not "}be ${o} but got ${t}`)},r=(o,c)=>{const a=t.querySelectorAll(o);this.test.assert(!!a.length==c,`Expected to ${c?"":"not "}find '${o}' in ${e}, but got ${a.length} matches.`);const p=(d,m)=>{let u=0;for(const g of a)u+=g.innerHTML.includes(d)?1:0;this.test.assert(u!=0==m,`Expected to ${c?"":"not "}find '${o}' with content '${d}' in ${e}, but got ${u} matches.`)};return{with:d=>{p(d,!0)},without:d=>{p(d,!1)}}};return{to_exist:()=>{i(!0)},to_not_exist:()=>{i(!1)},to_be:o=>{s(o,!0)},to_not_be:o=>{s(o,!1)},to_have:o=>r(o,!0),to_not_have:o=>r(o,!1)}}}S.defineElement();function N(n,t,e){const i=e[2]/2,s=e[3]/2;return n>=e[0]-i&&t>=e[1]-s&&n<=e[0]+i&&t<=e[1]+s}function l(n,t,e){return n=Math.max(n,t),n=Math.min(n,e),n}class k extends h{get html(){return`
      <div part="titlebar" draggable="true">
        <div part="title">${this.title||""}</div>
        <div class="spacer"></div>
        <div class="buttons">
          <button part="maximize" href="#">&#9633;</button>
          <button part="close" href="#">X</button>
        </div>
      </div>
      <div part="content">
        <slot></slot>
      </div>
      ${this.maximized?"":'<button part="resize" draggable="true">&#9698;</button>'}
    `}get css(){return`
      :host {
        visibility: hidden;
        position: fixed;
        left: ${this.x||0}px;
        top: ${this.y||0}px;
        width: ${this.width||0}px;
        height: ${this.height||0}px;
        max-width: 100%;
        max-height: 100%;
        z-index: ${this.z||0};
        background-color: inherit;
        font-family: inherit;
        display: flex;
        flex-direction: column;
      }

      :host([opened]) {
        visibility: visible;
      }

      :host([maximized]) {
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
      }

      :host([template]) {
        visibility: hidden;
      }

      div[part="titlebar"] {
        display: flex;
        cursor: grab;
      }

      div[part="content"] {
        display: flex;
        flex-grow: 1;
        overflow: auto;
      }

      div[part="title"] {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      div.spacer {
        flex-grow: 1;
      }

      div.buttons {
        display: flex;
      }

      button {
        text-decoration: none;
        color: inherit;
        background: none;
        border: none;
        padding: 0;
        font: inherit;
        font-family: inherit;
        cursor: pointer;
      }

      button[part="resize"] {
        position: absolute;
        bottom: 1px;
        right: 2px;
        cursor: grab;
      }

      button[part="maximize"], button[part="close"] {
        width: 1em;
        height: 1em;
      }
    `}static get observedAttributes(){return["title","opened","maximized","template","width","height","x","y","z"]}get CLEANUP_MS(){return 4e3}get OPEN_MS(){return 10}get MIN_WINDOW_SIZE(){return 240}get STUB_PREFIX(){return"yl-stub-"}get active(){return this.constructor._active}set active(t){this.constructor._active!==t&&(t&&(t.z=201),this.constructor._active&&(this.constructor._active.z=200),this.constructor._active=t)}get keyListener(){return this.constructor._keyListener}set keyListener(t){this.constructor._keyListener&&document.removeEventListener("keydown",this.constructor._keyListener),this.constructor._keyListener=t,document.addEventListener("keydown",t)}get snapPoints(){const t=window.innerWidth,e=window.innerHeight,i=250,s=50;return[{drag:[t/2,0,i,s],drop:[0,0,t,e/2]},{drag:[t,e/2,s,i],drop:[t/2,0,t/2,e]},{drag:[t/2,e,i,s],drop:[0,e/2,t,e/2]},{drag:[0,e/2,s,i],drop:[0,0,t/2,e]}]}drop(t){this.x=t[0],this.y=t[1],this.width=t[2],this.height=t[3]}stamp(t){let e=this.outerHTML;for(const s of t.attributes)e=e.replaceAll(this.STUB_PREFIX+s.name,t.getAttribute(s.name));e=e.replaceAll(new RegExp(`(${this.STUB_PREFIX})\\w+`,"g"),"");const i=new DOMParser().parseFromString(e,"text/html").body.firstChild;i.dataset.receive="",i.removeAttribute("template"),this.parentElement.insertBefore(i,this),i.open()}open(){this.openTimeout=this.openTimeout||setTimeout(()=>{this.opened=!0,this.active=this},this.OPEN_MS)}close(){this.opened=!1,this.destroyTimeout=this.destroyTimeout||setTimeout(()=>{this.parentNode.removeChild(this)},this.CLEANUP_MS)}renderedCallback(){this.dom.close=this.root.querySelector('button[part="close"]'),this.dom.maximize=this.root.querySelector('button[part="maximize"]'),this.dom.resize=this.root.querySelector('button[part="resize"]'),this.dom.titlebar=this.root.querySelector('div[part="titlebar"]'),this.dom.content=this.root.querySelector('div[part="content"]'),this.onclick=()=>{this.active=this},this.dom.close.onclick=()=>{this.close()},this.dom.maximize.onclick=()=>{this.maximized=!this.maximized},this.dom.titlebar.ondragstart=t=>{this.dom.content.style["pointer-events"]="none",this.dragX=t.clientX,this.dragY=t.clientY},this.dom.titlebar.ondragend=t=>{if(this.disabled=!1,this.active=this,this.maximized)return;const e=this.dragX-t.clientX,i=this.dragY-t.clientY;this.x=this.offsetLeft-e,this.y=this.offsetTop-i,this.x=l(this.x,-this.width/2,window.innerWidth-this.width/2),this.y=l(this.y,0,window.innerHeight-32);const s=l(t.clientX,0,window.innerWidth),r=l(t.clientY,0,window.innerHeight);for(const o of this.snapPoints)if(N(s,r,o.drag)){this.drop(o.drop);break}},this.dom.resize&&(this.dom.resize.ondragstart=t=>{this.dragX=t.clientX,this.dragY=t.clientY},this.dom.resize.ondragend=t=>{if(this.maximized)return;const e=this.dragX-t.clientX,i=this.dragY-t.clientY;this.width=this.offsetWidth-e,this.height=this.offsetHeight-i,this.width=l(this.width,this.MIN_WINDOW_SIZE,window.innerWidth),this.height=l(this.height,this.MIN_WINDOW_SIZE,window.innerHeight)})}connectedCallback(){if(this.template)return;this.width=this.width||640,this.height=this.height||480;const t=document.querySelectorAll("yl-window[opened]").length+1,e=Math.max(window.innerWidth-this.width,0)/2+t*10,i=Math.max(window.innerHeight-this.height,0)/2+t*10;window.innerWidth<this.width&&(this.maximized=!0),this.x=this.x||e,this.y=this.y||i,this.z=this.z||200,this.active||(this.active=this),this.keyListener||=s=>{if(this.active){if(s.shiftKey){let r=null;switch(s.key){case"ArrowUp":r=this.snapPoints[0].drop;break;case"ArrowRight":r=this.snapPoints[1].drop;break;case"ArrowDown":r=this.snapPoints[2].drop;break;case"ArrowLeft":r=this.snapPoints[3].drop;break}r&&this.active.drop(r)}switch(s.key){case"f":s.shiftKey&&(this.active.maximized=!this.active.maximized);break;case"Escape":this.active.close(),this.active=document.querySelector("yl-window[opened]");break}}}}}k.defineElement();
