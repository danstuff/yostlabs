import ylComponent from './yl-component';

export default class ylTest extends ylComponent {
  static get observedAttributes() {
    return ['name', 'src', 'failcount'];
  }

  get html() {
    return `
      <div>${this.name}</div>
      <slot></slot>
      <div>Failed examples: ${this.failcount || 0}</div>
    `;
  }

  get passOrFail() {
    return this.result == 'running' ? 'PASS' : 'FAIL';
  }

  connectedCallback() {
    this.name = "Loading Tests...";
    this.failcount = 0;

    this.tests = {};
    this.describeStack = [];

    // TODO I'm very concerned about the security of this LOL
    fetch(this.src).then(response => response.text()).then(data => {
      Function(data).bind(this)();


      for (const key in this.tests) {
        this.currentTest = key;
        this.currentTestPassed = true;

        this.tests[key]();

        console.log(`${key}: ${this.currentTestPassed ? 'PASS' : 'FAIL'}`);

        if (!this.currentTestPassed) {

        }

        if (!this.currentTestPassed) {
          this.failcount = this.failcount + 1;
        }
      }
    });
  }

  does(event, element) {
    // TODO fire the given event on the element
  }

  expects(condition) {
    if (!condition) {
      this.currentTestPassed = false;
    }
  }

  describes(name, test) {
    this.describeStack.push(name);
    this.name = this.describeStack[0];

    test();
    this.describeStack.pop();;
  }

  has(name, test) {
    this.tests[`${this.describeStack} has ${name}`] = test;
  }
} 

ylTest.defineElement();