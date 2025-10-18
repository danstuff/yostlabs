import ylComponent from "./yl-component"

export default class ylTerminal extends ylComponent {  
  get html() {
    return `
      <slot name="logs"></slot>
      <slot name="inputs"></slot>
    `;
  }

  get css() {
    return `
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
      }

      slot[name="logs"] {
        display: flex;
        flex-direction: column-reverse;
        flex-grow: 1;
        overflow-y: scroll;
      }
      
      slot[name="inputs"] {
        display: flex;
        flex-direction: row;
      }
    `;
  }

  async print(url) {
    fetch(url).then(response => response.text()).then(text => {
      const log = document.createElement('p');
      log.innerText = text;
      this.dom.logs.appendChild(log);
    });
  }

  executeAction(action) {
    action = action.split(' ', 2);
    const command = action[0];
    const param = action[1];
    switch(command) {
      case 'print':
        this.print(param);
        break;
      case 'help':
        this.print('help.txt');
        break;
    }
  }

  connectedCallback() {
    this.dom.logs = this.querySelector('[slot="logs"]');
    this.dom.input = this.querySelector('input[type="text"]');
    this.dom.submit = this.querySelector('button');

    this.dom.input.focus();
    
    this.dom.input.addEventListener('keydown', event => {
      if (event.key == "Enter") {
        this.dom.submit.click();
      }
    });

    this.dom.submit.addEventListener('click', _ => {
        this.executeAction(this.dom.input.value);       
        this.dom.input.value = "";
    });
  }
}

ylTerminal.defineElement();